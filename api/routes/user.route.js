import { verifyToken } from "../utils/verifyUser";

const express = require("express");
const updateUser = require("../controller/user.controller");

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);

export default router;
