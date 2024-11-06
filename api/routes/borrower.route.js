const express = require("express");
const router = express.Router();
const {
  borrowerSave,
  getBorrowers,
} = require("../controller/borrower.controller");

router.post("/saveborrower", borrowerSave);
router.get("/borrowers", getBorrowers);

module.exports = router;
