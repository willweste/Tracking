const db = require("../db");

// Create a new project in the database
const createProject = (req, res) => {
    const { name, description } = req.body;
    const user_id = req.user.user_id; // Retrieve the user ID from the authenticated user

    console.log("Request Body:", req.body); // Log the request body

    const sqlInsert =
        "INSERT INTO Projects (name, description) VALUES (?, ?)";
    db.query(sqlInsert, [name, description], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const projectId = result.insertId;
        const sqlInsertUserProject =
            "INSERT INTO User_Projects (userId, projectId) VALUES (?, ?)";
        db.query(sqlInsertUserProject, [user_id, projectId], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ projectId });
            }
        });
    });
};

// Fetch all projects from the database
const getAllProjects = (req, res) => {
    const user_id = req.user.user_id; // Retrieve the user ID from the authenticated user
    const sqlSelect =
        "SELECT Projects.id, Projects.name, Projects.description, Projects.createdAt, Projects.updatedAt FROM Projects JOIN User_Projects ON Projects.id = User_Projects.projectId WHERE User_Projects.userId = ? ORDER BY Projects.createdAt DESC";
    db.query(sqlSelect, [user_id], (err, result) => {
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
