const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  updateBookStatus,
  bookId,
  fetchBookCopies,
} = require("../controller/book.controller");

router.post("/create", createBook); // Create a new book
router.get("/books", getAllBooks);
router.get("/book-id/:id", bookId);
router.post("/render/:id");
router.patch("/status/:id", updateBookStatus);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);
router.get("/copies", fetchBookCopies)

module.exports = router;
