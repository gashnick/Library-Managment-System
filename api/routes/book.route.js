const express = require("express");
const router = express.Router();
const { createBook, getBooks } = require("../controller/book.controller");

router.post("/create", createBook); // Create a new book
router.get("/book", getBooks);

module.exports = router;
