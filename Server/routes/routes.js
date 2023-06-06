const express = require("express");
const router = express.Router();
const db = require("../db");

// Define routes below

router.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM Bugs";
  db.query(sqlGet, (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving bugs");
    } else {
      res.send(result);
    }
  });
});

// Fetch all bugs from the database
router.get("/api/bugs", (req, res) => {
  const sqlSelect = "SELECT * FROM Bugs";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving bugs from the database");
    } else {
      res.json(result);
    }
  });
});

router.post("/api/create", (req, res) => {
  const { title, description } = req.body;

  // Check if a similar bug already exists based on title and description
  const sqlCheckDuplicate =
    "SELECT * FROM Bugs WHERE title = ? AND description = ?";
  db.query(sqlCheckDuplicate, [title, description], (err, result) => {
    if (err) {
      res.status(500).send("Error creating bug");
    } else {
      if (result.length > 0) {
        // If a similar bug already exists, return an appropriate response
        res.status(409).send("Bug already exists");
      } else {
        // Insert the bug into the database
        const sqlInsert = "INSERT INTO Bugs (title, description) VALUES (?, ?)";
        db.query(sqlInsert, [title, description], (err, result) => {
          if (err) {
            res.status(500).send("Error creating bug");
          } else {
            res.json({ message: "Bug created successfully" });
          }
        });
      }
    }
  });
});

// Export the router
module.exports = router;
