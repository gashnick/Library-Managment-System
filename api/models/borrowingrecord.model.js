// models/BorrowingRecord.js
const mongoose = require("mongoose");

const BorrowingRecordSchema = new mongoose.Schema({
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Borrower",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowedDate: {
    type: Date,
    default: Date.now,
  },
  returnedDate: {
    type: Date,
    default: null, // Set when the book is returned
  },
});

module.exports = mongoose.model("BorrowingRecord", BorrowingRecordSchema);
