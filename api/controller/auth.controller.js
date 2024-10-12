const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");

const singup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser
    .save()
    .then((result) => {
      console.log("user created successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  singup,
};
