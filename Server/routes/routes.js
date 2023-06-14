const express = require("express");
const router = express.Router();
const bugRouter = require("../models/bug");
const userRouter = require("../models/user");
const authenticateToken = require("../middleware/auth");

router.use("/bugs", authenticateToken, bugRouter);
router.use("/users", userRouter);

module.exports = router;
