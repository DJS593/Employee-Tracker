// npm dependencies
var inquirer = require('inquirer');
cTable = require('console.table');
var mysql = require('mysql2');
require('dotenv').config()
 

// npm dependencies


//create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.db_password,
  database: 'employee_db'
});




const promptUser = () => { 
  return inquirer.prompt([
  
    
    {
      // choices for the user
      type: 'list',
      name: 'userChoices',
      message: 'What would you like to do?',
      choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit']
      
    }
  
  ])

    
  
    .then(answer => {         
      switch(answer.userChoices) {
        case 'view all departments':
          connection.query(
            'SELECT * FROM department',
            function(err, results, fields) {
              if (err) {
                throw err;
              }
              
              console.table(results);
              promptUser();
            }     
          )
            
        
        break;    
        
        case 'view all roles':
          connection.query(
            'SELECT * FROM role',
            function(err, results, fields) {
              if (err) {
                throw err;
              }

              console.table(results);
              promptUser();
            }
          );

          break;

          case 'view all employees':
            connection.query(
              'SELECT * FROM employee',
              function(err, results, fields) {
                if (err) {
                  throw err;
                }

                console.table(results);
                promptUser();
              }
            );

            break;

            case 'add a department':
              addDepartment();

              break;

            case 'add a role':
              addRole();

              break;

            case 'add an employee':
              addEmployee();

              break;

            case 'update an employee role':
              updateEmployee();

              break;

            case 'quit':

              return;
      
      }     

})};


addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What department do you want to add?',
            name: 'addDepartment'
        }
    ])

        .then(answer => {
          var sql = "INSERT INTO department (name) VALUES (?)";
          connection.query(sql, answer.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('added '+ answer.addDepartment);
            promptUser();
          });       
      });         
};


addRole = () => {
  inquirer.prompt([
      {
          type: 'input',
          message: 'What is the title of the role?',
          name: 'addTitle'
      },
      {
        type: 'input',
        message: 'What is the salary of the role?',
        name: 'addSalary'
      },
      {
        type: 'list',
        message: 'What department will this role be in?',
        name: 'chooseDepartment',
        choices: ['Sales', 'Finance', 'Marketing', 'Technology', 'Operations', 'Risk']
      }
  ])
      
      .then(answer => {
        let dept = answer.chooseDepartment;
        let salary = answer.addSalary;
        let title = answer.addTitle;
        let deptId = '';
        console.log(dept);
        console.log(answer.chooseDepartment);
        console.log(answer);
        if (dept === 'Sales') {
          deptId = '1';
        } else if (dept === 'Finance') {
            deptId = '2';
        } else if (dept === 'Marketing') {
            deptId = '3';
        } else if (dept === 'Technology') {
            deptId = '4';
        } else if (dept === 'Operations') {
            deptId = '5';
        } else if (dept === 'Risk') {
            deptId = '6';
        } else {
          console.log('no ID matches');
        }
          
        var sql = "INSERT INTO role SET ?";
        connection.query(sql, 
          {
            title: title, 
            salary: salary, 
            department_id: deptId}, 
          
          (err, result) => {
          
            if (err) throw err;
          console.log('added '+ answer.addTitle);
          
          promptUser();
        });       
    });         
};


addEmployee = () => {
  inquirer.prompt([
      {
          type: 'input',
          message: "What is the employee's first name?",
          name: 'addFirstName'
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'addLastName'
      },
      {
        type: 'input',
        message: "What is the employee ID?",
        name: 'addEmpId'
      },
      {
        type: 'input',
        message: "What is the employee's role ID?",
        name: 'addRoleId'
      },
      {
        type: 'input',
        message: "If the employee has a manager, what is the manager ID?",
        name: 'addManagerId'
      }
  ])

      .then(answer => {
        var sql = "INSERT INTO department (name) VALUES (?)";
        connection.query(sql, answer.addDepartment, (err, result) => {
          if (err) throw err;
          console.log('added '+ answer.addDepartment);
          promptUser();
        });       
    });         
};






promptUser();