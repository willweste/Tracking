const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
const passportConfig = require("../middleware/passportConfig");

passportConfig(passport);

router.post("/signup", userController.signup);

router.post("/login", passport.authenticate("local"), userController.login);

module.exports = router;
