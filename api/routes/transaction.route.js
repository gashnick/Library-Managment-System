const express = require("express");
const {
  issueBook,
  returnBook,
  getTransactions,
  findBook,
} = require("../controller/transaction.controller");
const router = express.Router();

router.post("/issue", issueBook);
router.post("/return/:bookId", returnBook);
router.get("/get", getTransactions);
router.get("/find", findBook);

module.exports = router;
