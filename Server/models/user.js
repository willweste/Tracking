const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User Registration
router.post("/signup", userController.signup);

module.exports = router;
