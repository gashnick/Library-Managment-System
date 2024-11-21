const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate book titles
  },
  author: {
    type: String,
    required: true,
  },
  country: String,
  imageLink: String,
  language: String,
  link: String,
  pages: Number,
  year: Number,
  status: {
    type: String,
    required: true,
    default: "Available", // Sets default status to "Available"
  },
});

module.exports = mongoose.model("Book", bookSchema);
