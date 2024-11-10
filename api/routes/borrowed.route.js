// routes/borrowedBooks.js
const express = require("express");
const {
  addBorrowedBook,
  getBorrowedBook,
} = require("../controller/borrowed.controller");
const router = express.Router();

// POST endpoint to add a borrowed book
router.post("/addborrowed", addBorrowedBook);

// GET endpoint to retrieve all borrowed books
router.get("/getborrowed", getBorrowedBook);

module.exports = router;
