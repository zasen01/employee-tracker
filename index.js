//Bring in inquirer package
const inquirer = require('inquirer');
//bring in database connection
const db = require("./config/connection");
const { printTable } = require('console-table-printer');
const { listenerCount } = require('./config/connection');
//use inquirer to build menu of task items
function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'task',
        message: 'What action would you like to take?',
        choices: ['Add Department', 'Add Role', 'Add Employee','Update Employee', 'View Departments', 'View Roles', 'View Employees', 'Delete Employee', 'Exit']
    }).then(({ task }) => {
        if (task === 'Add Department') {
            addDepartment()
        } else if (task === 'Add Role') {
            addRole()
        } else if (task === 'Add Employee') {
            addEmployee()
        } else if (task === 'Update Employee') {
            updateEmployee()
        } else if (task === 'View Departments') {
            viewDepartment()
        } else if (task === 'View Roles') {
            viewRole()
        } else if (task === 'View Employees') {
            viewEmployee()
        } else if (task === 'Delete Employee') {
            deleteEmployee()
        } else { process.exit() }
    })
}
//perform db.query to get info from mysql 
const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'What is the name of the new Department'
    }).then(({ name }) => {
        var deptObj = { dept_name: name };
        db.promise().query('INSERT INTO department SET ?', deptObj).then(([data]) => {
            if (data.affectedRows > 0) {
                viewDepartment();
            } else {
                console.info('Department Creation Failed');
                mainMenu();
            }
        })
    })
}
const addRole = async () => {
    const [department] = await db.promise().query('SELECT * FROM department');
    const depArray = department.map((dept) => (
        { name: dept.dept_name, value: dept.id }
    ));
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the new Role'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the Salary for this Role'
        },
        {
            type: 'list',
            name: 'deptID',
            message: 'Please Select the Department',
            choices: depArray
        }
    ]).then(({ title, salary, deptID }) => {
        var roleObj = { title: title, salary: salary, dept_id: deptID };
        db.promise().query('INSERT INTO role SET ?', roleObj).then(([data]) => {
            if (data.affectedRows > 0) {
                viewRole();
            } else {
                console.info('Role Creation Failed');
                mainMenu();
            }
        })
    })
}
const addEmployee = async () => {
    const [manager] = await db.promise().query('SELECT * FROM employee');
    const managerArry = manager.map(({ id, first_name, last_name }) => (
        { name: first_name + ' ' + last_name, value: id }
    ));
    const [roles] = await db.promise().query('SELECT * FROM role');
    const roleArry = roles.map(({ id, title }) => (
        { name: title, value: id }
    ));
    const completeArry = [...managerArry, { name: 'NONE', value: null }];
    console.log(managerArry);
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: 'What is the First name of the new Employee'
        },
        {
            type: 'input',
            name: 'last',
            message: 'What is the Last name of the new Employee'
        },
        {
            type: 'list',
            name: 'manId',
            message: 'Please Select the Manager',
            choices: completeArry
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Please Select the Role',
            choices: roleArry
        }
    ]).then(({ first, last, manId, roleId }) => {
        var employeeObj = { first_name: first, last_name: last, role_id: roleId, manager_id: manId };
        console.log(employeeObj);
        db.promise().query('INSERT INTO employee SET ?', employeeObj).then(([data]) => {
            if (data.affectedRows > 0) {
                viewEmployee();
            } else {
                console.info('Employee Creation Failed');
                mainMenu();
            }
        })
    })

}
const deleteEmployee = async() =>{
    const [employee] = await db.promise().query('SELECT * FROM employee');
    const employeeArry = employee.map(({ id, first_name, last_name }) => (
        { name: first_name + ' ' + last_name, value: id }
    ));
    inquirer.prompt({
        type:'list',
        name:'employee',
        message:'Select employee to Delete',
        choices:employeeArry
    }
    ).then(answer => {
        db.promise().query('DELETE FROM employee WHERE id=?', answer.employee).then(([data])=>{
            if (data.affectedRows > 0) {
                viewEmployee();
            } else {
                console.info('Employee Deletion Failed');
                mainMenu();
            }
        })
    })
}
const updateEmployee = async() =>{
    const [employee] = await db.promise().query('SELECT * FROM employee');
    const employeeArry = employee.map(({ id, first_name, last_name }) => (
        { name: first_name + ' ' + last_name, value: id }
    ));
    const [roles] = await db.promise().query('SELECT * FROM role');
    const roleArry = roles.map(({ id, title }) => (
        { name: title, value: id }
    ));
    inquirer.prompt([{
        type:'list',
        name:'employee',
        message:'Select employee to Update',
        choices:employeeArry
    },{
        type:'list',
        name:'role',
        message:'Select New Role',
        choices:roleArry
    }]
    ).then(answer => {
        db.promise().query('UPDATE employee SET ? WHERE ?', [{role_id:answer.role},{id:answer.employee}]).then(([data])=>{
            if (data.affectedRows > 0) {
                viewEmployee();
            } else {
                console.info('Employee Deletion Failed');
                mainMenu();
            }
        })
    })
}
const viewDepartment = () => {
    db.promise().query('SELECT * FROM department').then(([data]) => {
        printTable(data);
        mainMenu();
    })
}
const viewRole = () => {
    db.promise().query('SELECT role.title AS Role,role.salary AS Salary,department.dept_name AS Department FROM role LEFT JOIN department on role.dept_id = department.id').then(([data]) => {
        printTable(data);
        mainMenu();
    })
}
const viewEmployee = () => {
    db.promise().query('SELECT CONCAT (employee.first_name," ", employee.last_name) AS Name, role.title AS Title, role.salary AS Salary,department.dept_name AS Department FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.dept_id = department.id').then(([data]) => {
        printTable(data);
        mainMenu();
    })
}
//use console.table to make different charts appear in our console

mainMenu();