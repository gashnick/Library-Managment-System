const verifyToken = require("../utils/verifyUser");

const express = require("express");
const { updateUser, getUsers } = require("../controller/user.controller");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.post("/allusers", getUsers);

module.exports = router;
