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
    default: "Available",
  },
});

module.exports = mongoose.model("Book", bookSchema);
