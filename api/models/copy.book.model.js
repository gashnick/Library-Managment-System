const mongoose = require("mongoose");
const bookCopySchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Borrowed"],
    default: "Available",
  },
  borrowDate: { type: Date, default: null },
  returnDate: { type: Date, default: null },
  quantity: { type: Number, required: true, min: 0 },
  borrower: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    contact: { type: String },
  },
});

const BookCopy = mongoose.model("BookCopy", bookCopySchema, "bookCopies"); // Explicitly specify 'bookCopies' as the collection name

module.exports = BookCopy;
