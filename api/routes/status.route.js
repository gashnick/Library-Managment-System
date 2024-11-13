// Import necessary modules
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const bookFilePath = path.join(__dirname, "../client/public/book.json");

// Endpoint to update book status
router.post("/update-status", (req, res) => {
  const { bookId, status } = req.body;

  // Read current books data
  fs.readFile(bookFilePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    let books = JSON.parse(data);
    // Find the book by ID and update its status
    books = books.map((book) =>
      book.id === bookId ? { ...book, status } : book
    );

    // Write the updated data back to book.json
    fs.writeFile(bookFilePath, JSON.stringify({ books }, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      res.send("Book status updated successfully");
    });
  });
});

module.exports = router;
