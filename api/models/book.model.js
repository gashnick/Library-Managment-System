// models/Book.js
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  publicationYear: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["available", "borrowed"],
    default: "available",
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Borrower",
    default: null, // null if the book is available
  },
  borrowedDate: {
    type: Date,
    default: null,
  },
  returnDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Book", BookSchema);
