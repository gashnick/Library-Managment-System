const mongoose = require("mongoose");
const returnedBookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  year: Number,
  borrowerName: String,
  returnDate: Date,
  status: String,
});

const ReturnedBook = mongoose.model("ReturnedBook", returnedBookSchema);
