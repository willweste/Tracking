const express = require("express");
const router = express.Router();
const db = require("../Server/db");

// Fetch all bugs from the database
router.get("/", (req, res) => {
  const sqlSelect = "SELECT * FROM Bugs";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
});

// Create a new bug in the database
router.post("/create", (req, res) => {
  const { title, description } = req.body;
  const sqlInsert = "INSERT INTO Bugs (title, description) VALUES (?, ?)";
  db.query(sqlInsert, [title, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ bugId: result.insertId });
    }
  });
});

// Delete a bug from the database
router.delete("/:id", (req, res) => {
  const bugId = req.params.id;
  const sqlDelete = "DELETE FROM Bugs WHERE id = ?";
  db.query(sqlDelete, bugId, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ bugId });
    }
  });
});

module.exports = router;
