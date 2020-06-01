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

            case 'update employee manager':
                updateEmployeeManager();
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
    connection.query(sql, (err, results, fields) => {
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
    connection.query(sql, function(err, results, fields) {
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
    connection.query(sql, function(err, results, fields) {
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
                    
                    // return to main menu
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

  const managerInfo = `SELECT empl.manager_id, empl.first_name, empl.last_name, mgr.first_name, mgr.last_name, mgr.id 
                        FROM employee mgr 
                        LEFT JOIN employee empl ON empl.manager_id = mgr.id WHERE empl.manager_id is not null;`

    const roleInfo = `SELECT id, title, salary, department_id FROM role`;

    connection.query(roleInfo, (err, allRoles, fields) => {
        if(err) {
          throw err; 
        } 

        connection.query(managerInfo, (err, allManagers) => {
            if(err) {
                throw err;
            }
          
            const roleChoices = allRoles.map(role => {
                const roleChoice = {name: role.title, value: role.id};
                return roleChoice;
            });


            const managerChoices = allManagers.map(mgr => {
                const managerChoice = {name: mgr.first_name + " " + mgr.last_name , value: mgr.id};
                return managerChoice;
            });


            inquirer.prompt([
                {
                  type: 'input',
                  message: "What is the employee's first name?",
                  name: 'addFirstName',     
                },
                {
                  type: 'input',
                  message: "What is the employee's last name?",
                  name: 'addLastName',
                },
                {
                  type: 'list',
                  message: 'Select a role.',
                  name: 'addRoleId',
                  choices: roleChoices
                },
                {
                  type: 'list',
                  message: 'Select a manger.',
                  name: 'addManagerId',
                  choices: managerChoices
                }
            ])
            
            .then(answer => {
                // query to add an employee into the employee table
                const sql = `INSERT INTO employee SET ?`;
                connection.query(sql, 
                    {
                      first_name: answer.addFirstName,
                      last_name: answer.addLastName,
                      role_id: answer.addRoleId,
                      manager_id: answer.addManagerId 
                    },  
                    (err, result, fields) => {
                        if(err) {
                            throw err;
                        } 
                        // confirmation that role was added
                        console.log("Added Employee: " + answer.addFirstName + " " + answer.addLastName);
     
                        // return to main menu
                        promptUser();
             
                    });
            });
        });
    });
};


// change an employee's role
updateEmployeeRole = () => {

  // creating variables that contain all the employees (employees) and all the roles (roles) so they can be used as lists
  const employees = `SELECT * FROM employee`;
  const roles = `SELECT * FROM role`;

  // query all employees and define the result as allEmployeesForUpdate
  connection.query(employees, (err, employeeToUpdate) => {
      if(err) { 
          throw err;
      }
      // query all roles and define the result as allEmployeesRolesForUpdate
      connection.query(roles, (err, roleToUpdate) => {
          if(err) {
              throw err;
          }
          
          // utilizing the map method to create a new array with the desired objects
          const employeeUpdate = employeeToUpdate.map(employee => {
              const employeeUpdateNew = {name: (employee.first_name + " " + employee.last_name) , value: employee.id};
              return employeeUpdateNew;
          });

          const roleUpdate = roleToUpdate.map(role => {
              const roleUpdateNew = {name: role.title, value: role.id};
              return roleUpdateNew;
          });


          // prompting for the employee name and new role
          inquirer.prompt([
              {
                  type: 'list',
                  message: 'Select an employee.',
                  name: 'employeeList',
                  choices: employeeUpdate
              },
              {
                  type: 'list',
                  message: 'Select the new role.',
                  name: 'newEmployeeRole',
                  choices: roleUpdate
              }
          ])
          // query to change role          
          .then(answer => {
              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
              const params = [answer.newEmployeeRole, answer.employeeList]
              connection.query(sql, params, (err, result, fields) => {
                  if(err) {
                      throw err;
                  }  
                  // confirmation of the update
                  console.log('Role Updated!');
          
                  // return to main menue
                  promptUser();
         
              });
          });
      });
  });
};


//  change an employee's manager
updateEmployeeManager = () => {

    const employees = `SELECT * FROM employee`;
    const manager =   `SELECT empl.manager_id, empl.first_name, empl.last_name, man.first_name, man.last_name, man.id
                        FROM employee man
                        LEFT JOIN employee empl ON empl.manager_id = man.id 
                        WHERE empl.manager_id is not null;`


    connection.query(employees, (err, allEmployees) => {
        if(err) throw err;

        connection.query(manager, (err, allManagers) => {
            if(err) {
                throw err;
            }

            const employeeChoices = allEmployees.map(employee => {
                const employeeChoice = {name: (employee.first_name + " " + employee.last_name) , value: employee.id};
                return employeeChoice;
            })

            const managerChoices = allManagers.map(man => {
                const managerChoice = {name: man.first_name + " " + man.last_name , value: man.id};
                return managerChoice;
            })

            // prompt two lists: 1. for the employee to be impacted and 2. the new manager
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Select an employee.',
                    name: 'employeeToUpdate',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    message: 'Select a manager',
                    name: 'managerToUpdate',
                    choices: managerChoices
                }
            ])
            .then(answer => {
                // query to update manager based on id
                const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                const params = [answer.managerToUpdate, answer.employeeToUpdate]
                connection.query(sql, params, (err, result) => {
                    if(err) {
                        throw err;
                    }
                    // confirmaton 
                    console.log('Manager Updated!');
                    
                    // return to main menu
                    promptUser();
            
                });
            });
        });
    });
};


// view which employees have direct reports and how many
viewEmployeeByManager = () => {

    const sql = `SELECT empl.manager_id, man.first_name, man.last_name,
        COUNT(*) FROM employee empl, employee man
        WHERE empl.manager_id = man.id
        GROUP by empl.manager_id
        ORDER BY empl.manager_id;`     
  
    connection.query(sql, (err, result, fields) => {
        if (err) {
            throw err;
        }  
        
        console.table(result);

        // return to main menu
        promptUser();
    });

};  


// view employees by department  
viewEmployeesByDepartment = () => {
    // query to show employees by department    
    const sql = `SELECT department.name, COUNT(employee.id)
                    FROM  employee 
                    JOIN role ON employee.role_id = role.id
                    JOIN department ON role.department_id = department.id
                    GROUP BY  department_id`;

    connection.query(sql, (err, result, fields) => {
        if(err) {
            throw err;
        }  
        console.log('Employees by department...\n')
        console.table(result);

        // return to main menu
        promptUser();
    })
};


//function to delete a Department
deleteDepartment = () => {

  const sql = `SELECT * FROM department`;

  connection.query(sql, (err, allDepartments) => {
      if(err) {
          throw err;
      }
      const deleteDepartmentChoices = allDepartments.map(department => {
          const deleteDepartmentChoice = {name: department.name, value: department.id};
          return deleteDepartmentChoice;
      })

      inquirer.prompt([
          {
              type: 'list',
              message: 'Choose a department to delete?',
              name: 'department',
              choices: deleteDepartmentChoices
          }
      ])
      .then(answer => {
          // query to delete department by id
          const sql = `DELETE FROM department WHERE id = ?`;
          connection.query(sql, answer.department, (err, result, fields) => {
              if(err) {
                  throw err;
              }
              console.log('Department Deleted!');

              // return to main menu
              promptUser();
           
          });
      });
  });
};


// delete a role
deleteRole = () => {

    const sql = `SELECT * FROM role`;
    connection.query(sql, (err, RoleToDelete) => {
        if(err) {
            throw err;
        }

        const roleChoicesForDelete = RoleToDelete.map(role => {
            const roleChoiceForDelete = {name: role.title, value: role.id};
            return roleChoiceForDelete;
        });

      inquirer.prompt([
          {
              type: 'list',
              message: 'Choose a role to delete?',
              name: 'roleToDelete',
              choices: roleChoicesForDelete
          }
      ])
      .then(answer => {
          // query to delete a role by id
          const sql = `DELETE FROM role WHERE id = ?`;
          connection.query(sql, answer.roleToDelete, (err, result, fields) => {
              if(err) {
                  throw err;
              }
              console.log('Role Removed!');

              // return to main menu
              promptUser();        
          });
      });
  });
};


// delete an employee
deleteEmployee = () => {

  const sql = `SELECT * FROM employee`;
  connection.query(sql, (err, allEmployeesForDelete, fields) => {
      if(err) {
          throw err;
      }
      
      const employeeChoicesForDelete = allEmployeesForDelete.map(employee => {
          const employeeChoiceForDelete = {name: employee.first_name + " " + employee.last_name, value: employee.id};
          return employeeChoiceForDelete;
      });

      inquirer.prompt([
          {
              type: 'list',
              message: 'Choose an employee to delete?',
              name: 'employeeDelete',
              choices: employeeChoicesForDelete
          }
      ])
      .then(answer => {
          // query to delete an employee based on id
          const sql = `DELETE FROM employee WHERE id = ?`;
          connection.query(sql, answer.employeeDelete, (err, result, fields) => {
              if(err) {
                  throw err;
              }
              // success message
              console.log('Employee Removed!');
              
              // return to main menu
              promptUser();    
          });
      });
  });
};


// view budget by department (budget = sum of salary)
viewDepartmentBudget = () => {
  console.log('Showing all budget by department...\n');
  
  // query based on department and the sum of employee salary
  const sql = `SELECT department_id, department.name, SUM(salary) 
                  FROM  role 
                  JOIN department ON role.department_id = department.id
                  GROUP BY  department_id`;

  
  connection.query(sql, (err, result, fields) => {
      if(err) {
          throw err;
      }
      // budget based on salary
      console.table(result);

      // return to main menu
      promptUser();
  })

};


// initilize the main menu
promptUser();