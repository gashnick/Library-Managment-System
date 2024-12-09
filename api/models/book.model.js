const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  country: { type: String },
  imageLink: { type: String },
  language: { type: String },
  link: { type: String },
  pages: { type: Number },
  year: { type: Number },
  status: {
    type: String,
    required: true,
    default: "Available", // Could be "Available" or "Unavailable"
  },
  copies: { // Total number of copies available
    type: Number,
    required: true,
    default: 1, // Default to 1 when the book is first added
  },
  borrowedCopies: { // Number of borrowed copies
    type: Number,
    required: true,
    default: 0, // Default to 0 since no copies are borrowed initially
  },
  remainingCopies: {
    type: Number,
    required: true,
  },
});

// Middleware to calculate remainingCopies before saving the document
bookSchema.pre('save', function(next) {
  this.remainingCopies = this.copies - this.borrowedCopies;
  next();
});

module.exports = mongoose.model("Book", bookSchema);
