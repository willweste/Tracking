const express = require("express");
const router = express.Router();
const bugRouter = require("../bug");

// Use the bug router for '/bugs' routes
router.use("/bugs", bugRouter);

// Create a new bug
router.post("/create", (req, res) => {
  // Code to create a new bug
});

module.exports = router;
