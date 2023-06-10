const express = require("express");
const router = express.Router();
const bugController = require("../controllers/bugController");

// Fetch all bugs from the database
router.get("/", bugController.getAllBugs);

// Create a new bug in the database
router.post("/create", bugController.createBug);

// Delete a bug from the database
router.delete("/:id", bugController.deleteBug);

module.exports = router;
