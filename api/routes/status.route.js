const express = require("express");
const updatedBookStatus = require("../controller/status.controller");
const router = express.Router();

// Endpoint to update book status
router.put("/update-status", updatedBookStatus);

module.exports = router;
