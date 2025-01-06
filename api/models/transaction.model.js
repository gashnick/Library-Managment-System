const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ["Borrowed", "Returned"],
    default: "Borrowed",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
