import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from './employeeSlice';

export function useEmployees() {
    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employees);

    const getEmployees = () => {
        dispatch(fetchEmployees());
    };

    const addEmployee = (employee) => {
        dispatch(createEmployee(employee));
    };

    const modifyEmployee = (employee) => {
        dispatch(updateEmployee(employee));
    };

    const removeEmployee = (employeeId) => {
        dispatch(deleteEmployee(employeeId));
    };

    return {
        employees,
        loading,
        error,
        getEmployees,
        addEmployee,
        modifyEmployee,
        removeEmployee
    };
}