const mongoose = require('mongoose')

const ReturnedBookSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // References the Book collection
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, default: "Returned" },
  borrowerName: { type: String, required: true },
  returnDate: { type: Date, default: Date.now },
});

