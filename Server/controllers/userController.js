const db = require("../db");

// User Registration
const signup = (req, res) => {
  const { username, email, password } = req.body;

  // TODO: Implement validation for username, email, and password

  const sqlInsert =
    "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
  db.query(sqlInsert, [username, email, password], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ userId: result.insertId });
    }
  });
};

module.exports = {
  signup,
};
