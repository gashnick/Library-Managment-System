const verifyToken = require("../utils/verifyUser");

const express = require("express");
const updateUser = require("../controller/user.controller");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);

module.exports = router;
