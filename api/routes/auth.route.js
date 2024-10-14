const express = require("express");
const { singup, signin } = require("../controller/auth.controller");

const route = express.Router();

route.post("/signup", singup);
route.post("/signin", signin);

module.exports = route;
