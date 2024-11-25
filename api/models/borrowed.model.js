// models/BorrowedBook.js
const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  year: Number,
  borrowerName: String,
  status: String,
  borrowDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BorrowedBook", borrowedBookSchema);
