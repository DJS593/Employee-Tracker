// npm dependencies and other requirements
var inquirer = require('inquirer');
cTable = require('console.table');
var mysql = require('mysql2');
const connection = require('./db/connection');
require('dotenv').config()
 


// Prompt the user to choose a specific action from a pre-defined list.  Once the choice is made the code will redirect to the appropriate function to complete the desired task //
const promptUser = () => { 
    return inquirer.prompt([
      
        {
          // choices for the user
          type: 'list',
          name: 'userChoices',
          message: 'What would you like to do?',
          choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role','update employee manager', 'view employees by manager', 'view employees by department', 'delete a department', 'delete a role', 'delete an employee', 'view department budget', 'quit']
          
        }
    ])

    // Once the chocie is made, the answer will be used to determine the correct funciton to be initilized to complete the task //
  
    .then(answer => {         
        switch(answer.userChoices) {
            case 'view all departments':
                viewDepartments();                    
                break;    
        
            case 'view all roles':
                viewRoles();          
                break;

            case 'view all employees':
                viewEmployees();            
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
                updateEmployeeRole();
                break;

            case 'view employees by manager':
                viewEmployeeByManager();
                break;

            case 'view employees by department':
                viewEmployeesByDepartment();
                break;

            case 'delete a department':
                deleteDepartment();
                break;

            case 'delete a role':
                deleteRole();
                break;

            case 'delete an employee':
                deleteEmployee();
                break;

            case 'view department budget':
                viewDepartmentBudget();
                break;

            case 'quit':
                return;
        }     
    });
};


/* begin of functions for command line interface */

// view all departments
viewDepartments = () => {
    console.log('Showing all departments...\n');

    // query to view all departments
    const sql = `SELECT * FROM department`
    connection.promise().query(sql, (err, results, fields) => {
        if (err) {
          throw err;
        }       
        console.table(results);

        // return to the choices list
        promptUser();
    });
};


// view all roles
viewRoles = () => {
    console.log('Showing all roles...\n');
     
    // query to view all roles
    const sql = `SELECT * FROM role`;
    connection.promise().query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }
        console.table(results);
              
        // return to choices list
        promptUser();
    });
};


// view all employees
viewEmployees = () => {
    console.log('Showing all employees...\n')
            
    // query to view all employees
    const sql = `SELECT * FROM employee`;
    connection.promise().query(sql, function(err, results, fields) {
        if (err) {
            throw err;
        }    
        console.table(results);
        
        // return to choices list
        promptUser();
    });
};


// add a department
addDepartment = () => {
    inquirer.prompt([
        
        // prompting what department to add
        {
          type: 'input',
          message: 'What department do you want to add?',
          name: 'addDepartment'
        }
    ])

        // query to add department to department table
        .then(answer => {
            const departmentName = answer.addDepartment;
            const sql = `INSERT INTO department SET ?`;
            connection.query(sql, 
                {
                    name: departmentName, 
                },   
                (err, results, fields) => {
                    if (err) {
                        throw err;
                    }
                    // confimration the department was added
                    console.log('added '+ answer.addDepartment);
                    
                    promptUser();
                }
            );       
        });         
};


// add a new role to the role table
addRole = () => {
    
    // prompting for new role information
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
        
        // defining the answers as variables to make the query easier to code; all of this can be moved inside the connection method if desired //
        let dept = answer.chooseDepartment;
        let salary = answer.addSalary;
        let title = answer.addTitle;
        let deptId = '';
        
        // identifying the department id to be used
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
          
        // query to insert the new role into the role table
        var sql = `INSERT INTO role SET ?`;
        connection.query(sql, 
            {
              title: title, 
              salary: salary, 
              department_id: deptId}, 
            
            (err, result, fields) => {
            
                if (err) {
                    throw err;
                }
                console.log('added '+ dept + ' ' + title);
            
                promptUser();
            });       
    });         
};



//function to add a Employee
addEmployee = () => {

  const managerQueryForAddEmployee =   `SELECT 
                                              empl.manager_id, 
                                              empl.first_name, 
                                              empl.last_name, 
                                              mgr.first_name, 
                                              mgr.last_name, 
                                              mgr.id
                                          FROM employee mgr
                                          LEFT JOIN employee empl ON empl.manager_id = mgr.id 
                                          WHERE empl.manager_id is not null;`

  const rolesForAddEmployee = `SELECT id, title, salary, department_id FROM role`;

  connection.query(rolesForAddEmployee, (err, allRoles) => {
      if(err) throw err;


      connection.query(managerQueryForAddEmployee, (err, allManagers) => {
          if(err) throw err;

          const roleChoices = allRoles.map(role => {
              const roleChoice = {name: role.title, value: role.id};
              return roleChoice;
          })


          const managerChoices = allManagers.map(mgr => {
              const managerChoice = {name: mgr.first_name + " " + mgr.last_name , value: mgr.id};
              return managerChoice;
          })


          inquirer.prompt([
              {
                  type: "input",
                  message: "What is the employee's first name?",
                  name: "addEmployeeFirstNameNew",
                  validate: firstNameInput => {
                      if(firstNameInput.match("[a-zA-Z]+$")) {
                          return true;
                      } else {
                          console.log("Please enter the First name as a string!");
                          return false;
                      }
                  }
              },
              {
                  type: "input",
                  message: "What is the last name of the employee?",
                  name: "addEmployeeLastNameNew",
                  validate: lastNameInput => {
                      if(lastNameInput.match("[a-zA-Z]+$")) {
                          return true;
                      } else {
                          console.log("Please enter the Last name as a string!");
                          return false;
                      }
                  }
              },
              {
                  type: "list",
                  message: "Select from the list of roles ",
                  name: "addEmployeeRoleIdNew",
                  choices: roleChoices
              },
              {
                  type: "list",
                  message: "Select from the list of managers ",
                  name: "addEmployeeManagerIdNew",
                  choices: managerChoices
              }
          ])
          .then(answer => {
              const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
              VALUES (?, ?, ?, ?)`;
              const params = [answer.addEmployeeFirstNameNew, answer.addEmployeeLastNameNew, answer.addEmployeeRoleIdNew, answer.addEmployeeManagerIdNew]
              connection.query(sql, params, (err, result) => {
                  if(err) throw err;
                  console.log("Added Role: " + answer.addEmployeeFirstNameNew + " " + answer.addEmployeeLastNameNew);
     

                  promptUser();
             
              })
          })

      })

  })

};



// change an employee's role
updateEmployeeRole = () => {

  // creating variables that contain all the employees (employeesNew) and all the roles (rolesNew) so they can be used in lists
  const employeesNew = `SELECT * FROM employee`;
  const rolesNew = `SELECT * FROM role`;

  // query all employees and define the result as allEmployeesForUpdate
  connection.query(employeesNew, (err, allEmployeesForUpdate) => {
      if(err) throw err;

      // query all roles and define the result as allEmployeesRolesForUpdate
      connection.query(rolesNew, (err, allEmployeeRolesForUpdate) => {
          if(err) throw err;

          // utilizing the map method to create a new array with the desired objects
          const employeeChoicesForUpdate = allEmployeesForUpdate.map(employee => {
              const employeeChoiceForUpdate = {name: (employee.first_name + " " + employee.last_name) , value: employee.id};
              return employeeChoiceForUpdate;
          })

          const roleChoicesForUpdate = allEmployeeRolesForUpdate.map(role => {
              const roleChoiceForUpdate = {name: role.title, value: role.id};
              return roleChoiceForUpdate;
          })


          // prompting for the employee to change the new role
          inquirer.prompt([
              {
                  type: "list",
                  message: "Select from the list of employees ",
                  name: "employeeListForUpdate",
                  choices: employeeChoicesForUpdate
              },
              {
                  type: "list",
                  message: "Select from the list of roles ",
                  name: "employeeRoleListForUpdate",
                  choices: roleChoicesForUpdate
              }
          ])
          .then(answer => {
              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
              const params = [answer.employeeRoleListForUpdate, answer.employeeListForUpdate]
              connection.query(sql, params, (err, result) => {
                  if(err) throw err;
                  console.log("Updated Employee: " + answer.employeeListForUpdate + "and set Role to: " + answer.employeeRoleListForUpdate);
          
       
                  promptUser();
         
              })
          })

      })

  })

};







viewEmployeeByManager = () => {

  const sql = `SELECT manager_id, CONCAT(first_name, ' ', last_name) AS Name,
                  Count (*)  
                  FROM employee
                  WHERE manager_id = employee.id
                  GROUP By manager_id
                  ORDER BY manager_id ASC`

  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);

    promptUser();
  })

};  

// COUNT(id), CONCAT(first_name, " ", last_name) AS Name
  
viewEmployeesByDepartment = () => {
    console.log('Showing employees by department...\n');
    
    const sql = `SELECT *
                    FROM  employee 
                    JOIN role ON employee.role_id = role.id
                    JOIN department ON role.department_id = department.id
                    GROUP BY  department_id`;

    
    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.table(result);

        promptUser();
    })
};


viewDepartmentBudget = () => {
    console.log('Showing all budget by department...\n');
    
    const sql = `SELECT department_id, department.name, SUM(salary) 
                    FROM  role 
                    JOIN department ON role.department_id = department.id
                    GROUP BY  department_id`;

    
    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.table(result);

        promptUser();
    })

};


// view employees by manager
viewEmployeeByManager = () => {

  sql = `SELECT
            employee.manager_id,
            manager.first_name,
            manager.last_name,
            COUNT * FROM employee employee, employee manager 
              WHERE employee.manager_id = manager.id
              GROUP by employee.manager_id
              ORDER by employee.manager_id ASC;`

  connection.promise().query(sql, (err, result) => {
    if(err) throw err;
    
    console.tables(result);

    promptUser();
  })

}

//function to add a Employee
// addEmployee = () => {

//   const managerQueryForAddEmployee =   `SELECT 
//                                               empl.manager_id, 
//                                               empl.first_name, 
//                                               empl.last_name, 
//                                               mgr.first_name, 
//                                               mgr.last_name, 
//                                               mgr.id
//                                           FROM employee mgr
//                                           LEFT JOIN employee empl ON empl.manager_id = mgr.id 
//                                           WHERE empl.manager_id is not null;`

//   const rolesForAddEmployee = `SELECT id, title, salary, department_id FROM role`;

//   connection.query(rolesForAddEmployee, (err, allRoles) => {
//       if(err) throw err;


//       connection.query(managerQueryForAddEmployee, (err, allManagers) => {
//           if(err) throw err;

//           const roleChoices = allRoles.map(role => {
//               const roleChoice = {name: role.title, value: role.id};
//               return roleChoice;
//           })


//           const managerChoices = allManagers.map(mgr => {
//               const managerChoice = {name: mgr.first_name + " " + mgr.last_name , value: mgr.id};
//               return managerChoice;
//           })


//           inquirer.prompt([
//               {
//                   type: "input",
//                   message: "What is the employee's first name?",
//                   name: "addEmployeeFirstNameNew",
//                   validate: firstNameInput => {
//                       if(firstNameInput.match("[a-zA-Z]+$")) {
//                           return true;
//                       } else {
//                           console.log("Please enter the First name as a string!");
//                           return false;
//                       }
//                   }
//               },
//               {
//                   type: "input",
//                   message: "What is the last name of the employee?",
//                   name: "addEmployeeLastNameNew",
//                   validate: lastNameInput => {
//                       if(lastNameInput.match("[a-zA-Z]+$")) {
//                           return true;
//                       } else {
//                           console.log("Please enter the Last name as a string!");
//                           return false;
//                       }
//                   }
//               },
//               {
//                   type: "list",
//                   message: "Select from the list of roles ",
//                   name: "addEmployeeRoleIdNew",
//                   choices: roleChoices
//               },
//               {
//                   type: "list",
//                   message: "Select from the list of managers ",
//                   name: "addEmployeeManagerIdNew",
//                   choices: managerChoices
//               }
//           ])
//           .then(answer => {
//               const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
//               VALUES (?, ?, ?, ?)`;
//               const params = [answer.addEmployeeFirstNameNew, answer.addEmployeeLastNameNew, answer.addEmployeeRoleIdNew, answer.addEmployeeManagerIdNew]
//               connection.query(sql, params, (err, result) => {
//                   if(err) throw err;
//                   console.log("Added Role: " + answer.addEmployeeFirstNameNew + " " + answer.addEmployeeLastNameNew);
     

//                   promptUser();
             
//               })
//           })

//       })

//   })

// };



// // change an employee's role
// updateEmployeeRole = () => {

//   // creating variables that contain all the employees (employeesNew) and all the roles (rolesNew) so they can be used in lists
//   const employeesNew = `SELECT * FROM employee`;
//   const rolesNew = `SELECT * FROM role`;

//   // query all employees and define the result as allEmployeesForUpdate
//   connection.query(employeesNew, (err, allEmployeesForUpdate) => {
//       if(err) throw err;

//       // query all roles and define the result as allEmployeesRolesForUpdate
//       connection.query(rolesNew, (err, allEmployeeRolesForUpdate) => {
//           if(err) throw err;

//           // utilizing the map method to create a new array with the desired objects
//           const employeeChoicesForUpdate = allEmployeesForUpdate.map(employee => {
//               const employeeChoiceForUpdate = {name: (employee.first_name + " " + employee.last_name) , value: employee.id};
//               return employeeChoiceForUpdate;
//           })

//           const roleChoicesForUpdate = allEmployeeRolesForUpdate.map(role => {
//               const roleChoiceForUpdate = {name: role.title, value: role.id};
//               return roleChoiceForUpdate;
//           })


//           // prompting for the employee to change the new role
//           inquirer.prompt([
//               {
//                   type: "list",
//                   message: "Select from the list of employees ",
//                   name: "employeeListForUpdate",
//                   choices: employeeChoicesForUpdate
//               },
//               {
//                   type: "list",
//                   message: "Select from the list of roles ",
//                   name: "employeeRoleListForUpdate",
//                   choices: roleChoicesForUpdate
//               }
//           ])
//           .then(answer => {
//               const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
//               const params = [answer.employeeRoleListForUpdate, answer.employeeListForUpdate]
//               connection.query(sql, params, (err, result) => {
//                   if(err) throw err;
//                   console.log("Updated Employee: " + answer.employeeListForUpdate + "and set Role to: " + answer.employeeRoleListForUpdate);
          
       
//                   promptUser();
         
//               })
//           })

//       })

//   })

// };

//function to delete a Department
deleteDepartment = () => {

  const departmentList = `SELECT * FROM department`;

  connection.query(departmentList, (err, allDepartments) => {
      if(err) throw err;

      const departmentChoices = allDepartments.map(department => {
          const departmentChoice = {name: department.name, value: department.id};
          return departmentChoice;
      })

      inquirer.prompt([
          {
              type: "list",
              message: "What department do you want to delete?",
              name: "departmentName",
              choices: departmentChoices
          }
      ])
      .then(answer => {
          const sql = `DELETE FROM department WHERE id = ?`;
          const params = [answer.departmentName]
          console.log (answer.departmentName);
          connection.query(sql, params, (err, result) => {
              if(err) throw err;
              console.log("Deleted Department: " + answer.departmentName);

              promptUser();
           
          })
      })
  })
};

deleteRole = () => {

  const roleList = `SELECT * FROM role`;

  connection.query(roleList, (err, allRolesForDelete) => {
      if(err) throw err;

      const roleChoicesForDelete = allRolesForDelete.map(role => {
          const roleChoiceForDelete = {name: role.title, value: role.id};
          return roleChoiceForDelete;
      })

      inquirer.prompt([
          {
              type: "list",
              message: "What role do you want to delete?",
              name: "roleNameForDelete",
              choices: roleChoicesForDelete
          }
      ])
      .then(answer => {
          const sql = `DELETE FROM role WHERE id = ?`;
          const params = [answer.roleNameForDelete]
          connection.query(sql, params, (err, result) => {
              if(err) throw err;
              //console.log("Deleted Role: " + answer.roleNameForDelete);
              console.log('role removed');

              promptUser();
         
          })
      })
  })
};

deleteEmployee = () => {

  const employeeListForDelete = `SELECT * FROM employee`;

  connection.query(employeeListForDelete, (err, allEmployeesForDelete) => {
      if(err) throw err;

      const employeeChoicesForDelete = allEmployeesForDelete.map(employee => {
          const employeeChoiceForDelete = {name: employee.first_name + " " + employee.last_name, value: employee.id};
          return employeeChoiceForDelete;
      })

      inquirer.prompt([
          {
              type: "list",
              message: "Which employee do you want to remove?",
              name: "employeeNameForDelete",
              choices: employeeChoicesForDelete
          }
      ])
      .then(answer => {
          const sql = `DELETE FROM employee WHERE id = ?`;
          const params = [answer.employeeNameForDelete]
          connection.query(sql, params, (err, result) => {
              if(err) throw err;
              console.log("Removed employee: " + answer.employeeNameForDelete);
              

              promptUser();
    
          })
      })
  })
};




promptUser();