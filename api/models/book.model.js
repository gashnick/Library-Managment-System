const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  categories: String,
  year: String,
  edition: String,
  language: String,
  extension: String,
  pages: String,
  filesize: String,
  url: String,
  cover: String,
  status: {
    type: String,
    enum: ["Available", "Borrowed"],
    default: "Available",
  },
});

module.exports = mongoose.model("Book", bookSchema);
