const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Registration
const signup = (req, res) => {
  const { username, email, password } = req.body;

  // TODO: Implement validation for username, email, and password

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: "Server Error" });
      console.log("Error in signup:", err);
    } else {
      const sqlInsert =
          "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
      db.query(sqlInsert, [username, email, hashedPassword], (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          console.log("Error in signup:", err);
        } else {
          console.log("User successfully registered");
          res.json({ userId: result.insertId });
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
        console.log("Wrong password");
      } else {
        const user = result[0];
        // Compare the provided password with the stored password hash
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500).json({ error: "Server Error" });
          } else if (isMatch) {
            // Passwords match, create and return a JWT token
            const token = jwt.sign({ userId: user.id }, "your-secret-key");
            console.log("User logged in:", user.username);
            console.log("User ID:", user.id); // Log the userId in the console
            console.log("Token:", token); // Log the token in the console
            res.json({ token, userId: user.id }); // Include userId in the response JSON
          } else {
            res.status(401).json({ error: "Invalid email or password" });
          }
        });
      }
    }
  });
};

// User Logout
const logout = (req, res) => {
  // You can choose to implement additional logic here, such as token invalidation or blacklist
  console.log("User logged out");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  logout,
};
