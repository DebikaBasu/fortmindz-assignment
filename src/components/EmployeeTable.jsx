import { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Avatar, Button, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchEmployees, createEmployee, deleteEmployee } from '../redux/employeeSlice';

const EmployeeTable = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const employees = useSelector((state) => state.employees.employees);
    const loading = useSelector((state) => state.employees.loading);
    const error = useSelector((state) => state.employees.error);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleEditClick = (row) => {
        navigate('/update', { state: { employeeData: row.original } });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: '_id',
                header: 'Employee ID',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'image',
                header: 'Image',
                Cell: ({ cell }) => <Avatar alt="employee" src={cell.getValue()} />,
            },
            {
                accessorKey: 'fullName',
                header: 'Full Name',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.fullName,
                    helperText: validationErrors?.fullName,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            fullName: undefined,
                        }),
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
                muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    error: !!validationErrors?.email,
                    helperText: validationErrors?.email,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            email: undefined,
                        }),
                },
            },
            {
                accessorKey: 'age',
                header: 'Age',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.age,
                    helperText: validationErrors?.age,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            age: undefined,
                        }),
                },
            },
            {
                accessorKey: 'phone',
                header: 'Phone Number',
                muiEditTextFieldProps: {
                    type: 'tel',
                    required: true,
                    error: !!validationErrors?.phone,
                    helperText: validationErrors?.phone,
                },
                onFocus: () =>
                    setValidationErrors({
                        ...validationErrors,
                        phone: undefined,
                    }),
            },
            {
                accessorKey: 'salary',
                header: 'Salary',
                muiEditTextFieldProps: {
                    type: 'tel',
                    required: true,
                    error: !!validationErrors?.salary,
                    helperText: validationErrors?.salary,
                },
                onFocus: () =>
                    setValidationErrors({
                        ...validationErrors,
                        salary: undefined,
                    }),
            },
        ],
        [validationErrors],
    );

    const handleCreateEmployee = async ({ values, table }) => {
        const newValidationErrors = validateEmployee(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await dispatch(createEmployee(values));
        table.setCreatingRow(null);
    };

    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            dispatch(deleteEmployee(row.original._id));
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: employees, 
        createDisplayMode: 'modal',
        enableEditing: false,
        getRowId: (row) => row._id,
        positionActionsColumn: 'last',
        enableRowActions: true,
        muiToolbarAlertBannerProps: error
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '500px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateEmployee,
        state: {
            isLoading: loading,
            showAlertBanner: !!error,
            showProgressBars: loading,
        },
        renderRowActionMenuItems: ({ row }) => [
            <MenuItem key="edit" onClick={() => handleEditClick(row)}>
                Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={() => openDeleteConfirmModal(row)}>
                Delete
            </MenuItem>
        ],
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="contained"
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                Add New Employee
            </Button>
        ),
        initialState: { columnVisibility: { _id: false } },
    });

    return <MaterialReactTable table={table} />;
};

export default EmployeeTable;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

function validateEmployee(employee) {
    return {
        fullName: !validateRequired(employee.fullName)
            ? 'Full Name is Required'
            : '',
        age: !validateRequired(employee.age) ? 'Age is Required' : '',
        email: !validateEmail(employee.email) ? 'Incorrect Email Format' : '',
    };
}