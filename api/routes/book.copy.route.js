const express = require("express");

const {
  getCopy,
  borrowBook,
  returnBook,
} = require("../controller/book.copy.controller");

const router = express.Router();
router.get("/copies", getCopy);
router.post("/borrow", borrowBook);
router.put("/return/:bookId", returnBook);

module.exports = router;
