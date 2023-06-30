const db = require("../db");

// Create a new bug in the database
const createBug = (req, res) => {
  const { title, description, status, severity, assignedTo, reportedBy } = req.body;
  const user_id = req.user.user_id; // Retrieve the user ID from the authenticated user

  console.log("User ID:", user_id); // Log the user ID
  console.log("Request Body:", req.body); // Log the request body

  const sqlInsert =
      "INSERT INTO Bugs (title, description, user_id, status, severity, assignedTo, reportedBy) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sqlInsert, [title, description, user_id, status, severity, assignedTo, reportedBy], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const bugId = result.insertId;
      res.json({ bugId });
    }
  });
};

// Fetch all bugs from the database
const getAllBugs = (req, res) => {
  const user_id = req.user.user_id; // Retrieve the user_id from the authenticated user

  console.log("User ID:", user_id); // Log the user ID

  const sqlSelect =
      "SELECT id, title, description, Status, Severity, AssignedTo, ReportedBy, CreatedAt, UpdatedAt FROM Bugs WHERE user_id = ?";
  db.query(sqlSelect, [user_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
};




// Delete a bug from the database
const deleteBug = (req, res) => {
  const bugId = req.params.id;

  console.log("User ID:", req.user.user_id); // Log the user ID

  const sqlDelete = "DELETE FROM Bugs WHERE id = ? AND user_id = ?";
  db.query(sqlDelete, [bugId, req.user.user_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ bugId });
    }
  });
};

module.exports = {
  getAllBugs,
  createBug,
  deleteBug,
};
