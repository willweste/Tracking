const db = require("../db");
const bcrypt = require("bcrypt");

// User Registration
const signup = (req, res) => {
  const { username, email, password } = req.body;

  // TODO: Implement validation for username, email, and password

  // Generate a salt and hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: err.message });
      console.log("Error in signup:", err);
    } else {
      const sqlInsert =
        "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
      db.query(sqlInsert, [username, email, hashedPassword], (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          console.log("Error in signup:", err);
        } else {
          res.json({ message: "User registered successfully" });
          console.log("User registered succesfully");
        }
      });
    }
  });
};

// User Login
const login = (req, res) => {
  const { email, password } = req.body;

  // TODO: Implement validation for email and password

  const sqlSelect = "SELECT * FROM Users WHERE email = ?";
  db.query(sqlSelect, [email], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      console.log("Error in login:", err);
    } else {
      if (result.length === 0) {
        res.status(401).json({ error: "Invalid email or password" });
      } else {
        const user = result[0];

        // Compare the provided password with the stored password hash
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500).json({ error: err.message });
            console.log("Error in login:", err);
          } else {
            if (isMatch) {
              res.json({ message: "User logged in successfully" });
              console.log("User logged in successfully");
            } else {
              res.status(401).json({ error: "Invalid email or password" });
            }
          }
        });
      }
    }
  });
};

module.exports = {
  signup,
  login,
};
