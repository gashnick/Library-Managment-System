const express = require("express");
const { singup, signin, google } = require("../controller/auth.controller");

const route = express.Router();

route.post("/signup", singup);
route.post("/signin", signin);
route.post("/google", google);

module.exports = route;
