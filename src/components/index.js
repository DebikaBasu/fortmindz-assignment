const { default: EmployeeTable } = require("./EmployeeTable");
const { default: EmployeeUpdateForm } = require("./EmployeeUpdateForm");

module.exports = {
    EmployeeListing: EmployeeTable,
    UpdateEmployeePage: EmployeeUpdateForm
}