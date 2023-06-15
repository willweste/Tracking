const db = require("../db");

// Fetch all bugs from the database
const getAllBugs = (req, res) => {
  const sqlSelect = "SELECT * FROM Bugs";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
};

// Create a new bug in the database
const createBug = (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.id; // Retrieve the user_id from the authenticated user
  const sqlInsert = "INSERT INTO Bugs (title, description, user_id) VALUES (?, ?, ?)";
  db.query(sqlInsert, [title, description, user_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ bugId: result.insertId });
    }
  });
};


// Delete a bug from the database
const deleteBug = (req, res) => {
  const bugId = req.params.id;
  const sqlDelete = "DELETE FROM Bugs WHERE id = ?";
  db.query(sqlDelete, bugId, (err, result) => {
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
