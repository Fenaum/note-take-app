// server.js

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// API routes
app.get("/api/notes", (req, res) => {
  // Read the notes from the JSON file and return as response
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes." });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Failed to parse notes data." });
    }

    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  // Handle new note creation and save it to the JSON file
  const newNote = req.body;
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes." });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Failed to parse notes data." });
    }

    newNote.id = Date.now();
    notes.push(newNote);

    fs.writeFile("db/db.json", JSON.stringify(notes), "utf8", (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: "Failed to save the new note." });
      }

      res.json(newNote);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  // Handle note deletion by ID
  const noteIdToDelete = parseInt(req.params.id);
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read notes." });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ error: "Failed to parse notes data." });
    }

    const updatedNotes = notes.filter((note) => note.id !== noteIdToDelete);

    fs.writeFile(
      "db/db.json",
      JSON.stringify(updatedNotes),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).json({ error: "Failed to delete the note." });
        }

        res.json({ message: "Note deleted successfully." });
      }
    );
  });
});

// HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
