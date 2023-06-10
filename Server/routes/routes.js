const express = require("express");
const router = express.Router();
const bugRouter = require("../models/bug");
const userRouter = require("../models/user");

router.use("/bugs", bugRouter);
router.use("/users", userRouter);

module.exports = router;
