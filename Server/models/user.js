// user.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authentication");

// User Registration
router.post("/signup", userController.signup);

// User Login
router.post("/login", userController.login);

// User Logout
router.get("/logout", userController.logout);

// Fetch logged-in user data
router.get("/me", authenticateToken, userController.getLoggedInUser);

module.exports = router;
