const bycryptjs = require("bcryptjs");
import User from "../models/user.model";
import errorHandler from "../utils/error";

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  if (req.body.password) {
    req.body.password = bycryptjs.hashSync(req.body.password, 10);
  }
  try {
    const updateUser = await User.findByIdAndDelete(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.satus(200).json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;
