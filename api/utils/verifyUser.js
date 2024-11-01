const errorHandlerdler = require("./error");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandlerdler(401, "You are not authorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandlerdler(403, "Forbiden"));
    req.user = user;
    next();
  });
};
module.exports = {
  verifyToken,
};
