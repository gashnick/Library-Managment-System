const express = require("express");
const router = express.Router();
const { createBook, bookGet } = require("../controller/book.controller");

router.post("/create", createBook); // Create a new book
router.get("/books", bookGet);

module.exports = router;
