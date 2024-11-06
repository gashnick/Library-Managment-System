const mongoose = require("mongoose");

const borrowerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    booksBorrowed: {
      type: Number,
      default: 0,
    },
    returnDueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Borrower = mongoose.model("Borrower", borrowerSchema);
module.exports = Borrower;
