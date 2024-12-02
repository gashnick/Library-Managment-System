const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Borrowed', 'Returned'],
    default: 'Borrowed',
  },
  year: {
    type: Number,
  },
  borrowerName: {
    type: String,
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    default: null,  // Initially null, will be set when the book is returned
  },
});

module.exports = mongoose.model("BorrowedBook", borrowedBookSchema);
