// routes/borrowedBooks.js
const express = require("express");
const {
  getBorrowedBook,
  returnBook,
  returnedBooks,
  addBorrowedBooks,
} = require("../controller/borrowed.controller");
const router = express.Router();

// POST endpoint to add a borrowed book
router.post("/addborrowed", addBorrowedBooks);

// GET endpoint to retrieve all borrowed books
router.get("/getborrowed", getBorrowedBook);

router.post("/return/:id", returnBook);

router.get("/returned", returnedBooks);

module.exports = router;
