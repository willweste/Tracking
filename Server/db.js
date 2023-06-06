const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bluetick123!@#",
  database: "BugTracking_db",
});

module.exports = db;
