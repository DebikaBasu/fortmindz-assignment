import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('https://interviewtesting.onrender.com/v1/users/employee/list');
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch employees');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employees/createEmployee',
    async (employee, { rejectWithValue }) => {
        try {
            const { _id, ...employeeWithoutId } = employee;
            employeeWithoutId.salary = parseInt(employeeWithoutId.salary);

            const response = await fetch('https://interviewtesting.onrender.com/v1/users/employee/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeWithoutId),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create employee');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async (employee, { rejectWithValue }) => {
        try {
            const { _id, ...employeeWithoutId } = employee; // Excluding `_id` from the payload
            const response = await fetch(`https://interviewtesting.onrender.com/v1/users/employee-update/${_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeWithoutId),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update employee');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async (employeeId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://interviewtesting.onrender.com/v1/users/employee-remove/${employeeId}`,
                { method: 'DELETE' }
            );
            const data = await response.json();
            if (data.isSuccess === false) throw new Error(data.message);
            return employeeId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees.push(action.payload);
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const updatedEmployee = action.payload;
                state.employees = state.employees.map((employee) =>
                    employee._id === updatedEmployee._id ? updatedEmployee : employee
                );
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const employeeId = action.payload;
                state.employees = state.employees.filter((employee) => employee._id !== employeeId);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default employeeSlice.reducer;