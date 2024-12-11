const express = require("express");

const { getCopy, borrowBook } = require("../controller/book.copy.controller");

const router = express.Router();
router.get("/copies", getCopy);
router.post("/borrow", borrowBook);

module.exports = router;
