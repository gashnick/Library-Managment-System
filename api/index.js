const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const bookRoute = require("./routes/book.route");
const borrowerRoute = require("./routes/borrower.route");
const cors = require("cors");
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/borrower", borrowerRoute);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
