const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");

const singup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(2001).json("User created Successfuly!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  singup,
};
