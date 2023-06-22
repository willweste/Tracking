// userController.js

const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// User Registration
const signup = (req, res) => {
  const { username, email, password } = req.body;

  // TODO: Implement validation for username, email, and password

  const hashedPassword = bcrypt.hashSync(password, 10);

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
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (passwordMatch) {
          const token = jwt.sign(
              { user_id: user.id },
              process.env.ACCESS_TOKEN_SECRET
          );
          console.log("User logged in:", user.username);
          console.log("User ID:", user.id); // Log the userId in the console
          console.log("Token:", token); // Log the token in the console
          res.json({ token, userId: user.id, username: user.username }); // Include username in the response JSON
        } else {
          res.status(401).json({ error: "Invalid email or password" });
        }
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

// Fetch logged-in user data
const getLoggedInUser = (req, res) => {
  const userId = req.user.user_id; // Assuming the user_id is stored in req.user.user_id

  const sqlSelect = "SELECT * FROM Users WHERE id = ?";
  db.query(sqlSelect, [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      console.log("Error retrieving user data:", err);
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        const user = result[0];
        res.json({ username: user.username });
      }
    }
  });
};

module.exports = {
  signup,
  login,
  logout,
  getLoggedInUser,
};
