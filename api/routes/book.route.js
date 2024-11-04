const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
} = require("../controller/book.controller");

router.post("/create", createBook); // Create a new book
router.get("/books", getAllBooks);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;
