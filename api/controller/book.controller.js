const Book = require("../models/Book");
const errorHandler = require("../utils/error");
// Create a new book
const createBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    next(errorHandler(500, "Error adding the book"));
  }
};

// Get all books
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    next(errorHandler(404, "No books to display"));
  }
};

// Get a single book by ID
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      next(errorHandler(404, "Book not found"));
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error });
    next(errorHandler(500, "Error retrieving the book"));
  }
};

// Update a book by ID
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      next(errorHandler(404, "Book not found"));
    }
    res.status(200).json(book);
  } catch (error) {
    next(errorHandler(400, "Error updating book"));
  }
};

// Delete a book by ID
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      next(errorHandler(404, "Book not found"));
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Error deleting book"));
  }
};

module.exports = {
  createBook,
  getBookById,
  getBooks,
  updateBook,
  deleteBook,
};
