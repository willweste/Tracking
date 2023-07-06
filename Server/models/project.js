const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

//Fetch all projects from the database
router.get("/", projectController.getAllProjects);

// Create a new project in the database
router.post("/create", projectController.createProject);

module.exports = router;
