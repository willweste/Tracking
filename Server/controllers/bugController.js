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
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10; // Specify the desired page size

  console.log("User ID:", user_id); // Log the user ID

  const sqlSelect =
      "SELECT id, title, description, Status, Severity, AssignedTo, ReportedBy, CreatedAt, UpdatedAt FROM Bugs WHERE user_id = ? ORDER BY CreatedAt DESC LIMIT ? OFFSET ?";
  const sqlCount = "SELECT COUNT(*) AS totalCount FROM Bugs WHERE user_id = ?";

  db.query(sqlCount, [user_id], (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const totalCount = countResult[0].totalCount;
      const totalPages = Math.ceil(totalCount / pageSize);
      const offset = (page - 1) * pageSize;

      db.query(sqlSelect, [user_id, pageSize, offset], (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ data: result, totalCount, pageSize, totalPages }); // Include totalPages in the response
        }
      });
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
