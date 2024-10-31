const express = require("express");
const router = express.Router();
const {
  createBook,
  getBookById,
  getBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

router.post("/create", createBook); // Create a new book
router.get("/get-books", getBooks); // Get all books
router.get("/:id", getBookById); // Get book by ID
router.put("/:id", updateBook); // Update book by ID
router.delete("/:id", deleteBook); // Delete book by ID

module.exports = router;
