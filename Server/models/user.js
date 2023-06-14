const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User Registration
router.post("/signup", userController.signup);

// User Login
router.post("/login", userController.login);

// User Logout
router.get("/logout", userController.logout);

module.exports = router;
