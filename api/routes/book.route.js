const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  updateBookStatus,
} = require("../controller/book.controller");

router.post("/create", createBook); // Create a new book
router.get("/books", getAllBooks);
router.post("/render/:id");
router.put("/status/:id", updateBookStatus);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;
