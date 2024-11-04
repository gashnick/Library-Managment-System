const Book = require("../models/book.model");
const errorHandler = require("../utils/error");

// Create a new book
const createBook = async (req, res, next) => {
  const { title, author, genre, year, status } = req.body;

  // Basic validation
  if (!title || !author || !genre || !year) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const newBook = new Book({ title, author, genre, year, status });
  try {
    await newBook.save();
    res.status(201).json({
      success: true,
      message: "Book created successfully!",
      book: newBook,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error); // Handle other errors
  }
};
const getBooks = async (req, res, next) => {
  try {
    const book = await Book.find();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createBook,
  getBooks,
};
