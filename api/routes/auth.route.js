const express = require("express");
const {
  singup,
  signin,
  google,
  SignOut,
} = require("../controller/auth.controller.js");

const route = express.Router();

route.post("/signup", singup);
route.post("/signin", signin);
route.post("/google", google);
route.get("/signout", SignOut);

module.exports = route;
