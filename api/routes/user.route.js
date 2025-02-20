const verifyToken = require("../utils/verifyUser");

const express = require("express");
const { updateUser, getUsers, deleteUser } = require("../controller/user.controller");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.get("/allusers", getUsers);
router.delete("/users/:id", deleteUser)

module.exports = router;
