const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Book", 
    required: true 
  },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  borrowerName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Borrowed', 'Returned'], 
    default: 'Borrowed' 
  },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
});

module.exports = mongoose.model("BorrowedBook", borrowedBookSchema);
