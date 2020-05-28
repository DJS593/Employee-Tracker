/* code is from W3 schools */

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM department", function (err, result, fields) {
    if (err) throw err;
    console.log(fields);
  });
});


module.exports = connection;