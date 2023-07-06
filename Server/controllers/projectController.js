const db = require("../db");

// Create a new project in the database
const createProject = (req, res) => {
    const { name, description } = req.body;

    console.log("Request Body:", req.body); // Log the request body

    const sqlInsert =
        "INSERT INTO Projects (name, description) VALUES (?, ?)";
    db.query(sqlInsert, [name, description], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const projectId = result.insertId;
            res.json({ projectId });
        }
    });
};

// Fetch all projects from the database
const getAllProjects = (req, res) => {
    const sqlSelect =
        "SELECT id, name, description, createdAt, updatedAt FROM Projects ORDER BY createdAt DESC";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: result });
        }
    });
};

module.exports = {
    getAllProjects,
    createProject,
};
