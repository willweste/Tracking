const express = require("express");
const router = express.Router();
const bugRouter = require("../models/bug");
const userRouter = require("../models/user");
const projectRouter = require("../models/project")
const authenticateToken = require("../middleware/authentication");

router.use("/projects", authenticateToken, projectRouter);
router.use("/bugs", authenticateToken, bugRouter);
router.use("/users", userRouter);

module.exports = router;
