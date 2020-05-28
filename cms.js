// npm dependencies
var inquirer = require('inquirer');
cTable = require('console.table');
var mysql = require('mysql2');
/* const sequelize = require("./config/connection"); Research this one!!! is this the best way to create asynchronous functions */

 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Aidan593',
  database: 'employee_db'
});





//connection dependency
//const connection = require('./connection'); 


//query ORM dependencies
//const query = require("./mysql_queries/queries")

//seed dependencies
//const seeds = require("./seeds")


// model dependencies
const db = {};

//syncing with database
// db.sequelize.sync({ force: false }).then(function () {
//     // db.departments.create({name: "development"}).then(function(){
//     //     db.departments.findAll({}).then(function(res){
//     //         console.log(res)
//     //     })
//     // })
//     // seeds.employeeSeed()
//     promptUser();
// })


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
          
            }     
          );  
        
        break;     
      
        case 'view all roles':
          connection.query(
            'SELECT * FROM role',
            function(err, results, fields) {
              if (err) {
                throw err;
              }

              console.table(results);
            }
          );

          break;

          case 'view all roles':
            connection.query(
              'SELECT * FROM employee',
              function(err, results, fields) {
                if (err) {
                  throw err;
                }

                console.table(results);
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


promptUser();