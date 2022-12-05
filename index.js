//Bring in inquirer package
const inquirer = require('inquirer');
//bring in database connection
const db = require("./config/connection");

//use inquirer to build menu of task items
function mainMenu(){
    inquirer.prompt({
        type: 'list',
        name: 'task',
        message: 'What action would you like to take?',
        choices: ['Add Department', 'Add Role', 'Add Employee', 'View Departments', 'View Roles', 'View Employees','Exit']
    }).then(({task})=>{
        if(task === 'Add Department'){
            addDepartment()
        }else if(task === 'Add Role'){
            addRole()
        }else if(task === 'Add Employee'){
            addEmployee()
        }else if(task === 'View Departments'){
            viewDepartment()
        }else if(task === 'View Roles'){
            viewRole()
        }else if(task === 'View Employees'){
            viewEmployee()
        }else{process.exit()}
    })
}
//perform db.query to get info from mysql 
const addDepartment = ()=>{

}
const addRole= ()=>{
    
}
const addEmployee = ()=>{
    
}
const viewDepartment = ()=>{
    db.promise().query('SELECT * FROM department').then(data=>console.log(data))
}
const viewRole = ()=>{
    db.promise().query('SELECT * FROM role').then(data=>console.log(data))
}
const viewEmployee = ()=>{
    db.promise().query('SELECT * FROM employee').then(data=>console.log(data))
}
//use console.table to make different charts appear in our console

mainMenu();