const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoute = require("./routes/auth.route");
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
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoute);
