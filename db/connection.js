// npm dependencies
const mysql = require('mysql2');
require('dotenv').config()

//create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.db_password,
  database: 'employee_db'
});



// export connection so it can be used in cms.js
module.exports = connection;