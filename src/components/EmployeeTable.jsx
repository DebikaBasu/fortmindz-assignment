import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchEmployees } from '../redux/employeeSlice.js';

const EmployeeTable = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    return (
        <>
        <h1>Hello From EmployeeTable</h1>
        </>
    );
}

export default EmployeeTable;