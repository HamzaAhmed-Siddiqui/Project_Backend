const mysql = require("mysql2");

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "practice",
  password: "password",
  database: "Database",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log(
      "Error in  DB CONNECTION:  " + JSON.stringify(err, undefined, 2)+". Status code: " + err.code
    );
  } else {
    console.log("DB Connected Succesfully");
  }
});

module.exports = mysqlConnection;
