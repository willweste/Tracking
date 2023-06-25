const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../middleware/authorizationServer");
require('dotenv').config();

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

const login = (req, res) => {
  const { email, password } = req.body;

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
          const accessToken = generateAccessToken(user.id);
          const refreshToken = generateRefreshToken(user.id);

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", // Allow the cookie to be sent for cross-site requests
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
            path: "/",
          });

          res.json({
            accessToken,
            userId: user.id,
            username: user.username,
          });
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
  res.clearCookie("refreshToken", { path: "/refresh" }); // Clear the refresh token cookie
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

// Refresh access token
const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(decoded.user_id);
    res.json({ accessToken });
  });
};

module.exports = {
  signup,
  login,
  logout,
  getLoggedInUser,
  refreshToken,
};
