const express = require("express");
const { singup } = require("../controller/auth.controller");

const route = express.Router();

route.post("/signup", singup);

module.exports = route;
