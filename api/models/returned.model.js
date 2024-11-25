const mongoose = require("mongoose");

const ReturnedBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  status: { type: String, default: "Returned" },
  borrowerName: { type: String, required: true },
  returnDate: { type: Date, default: Date.now },
});

const ReturnedBook = mongoose.model("ReturnedBook", ReturnedBookSchema);

module.exports = ReturnedBook;
