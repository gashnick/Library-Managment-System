const mongoose = require("mongoose");

const borrowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensures email is unique
  booksBorrowed: { type: Number, default: 0 },
  returnDueDate: { type: Date, default: null },
});

const Borrower = mongoose.model("Borrower", borrowerSchema);
module.exports = Borrower;
