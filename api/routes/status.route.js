const express = require("express");
const updateStatus = require("../controller/status.controller");
const router = express.Router();

// Endpoint to update book status
router.put("/update-status", updateStatus);

module.exports = router;
