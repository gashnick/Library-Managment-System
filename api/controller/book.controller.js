const Book = require("../models/book.model");
const errorHandler = require("../utils/error");

// Create a new book
const createBook = async (req, res, next) => {
  const { title, author, genre, year, status } = req.body;

  const newBook = new Book({ title, author, genre, year, status });
  try {
    await newBook.save();
    res.status(201).json("Book created successfully!");
  } catch (error) {
    next(error);
  }
};

// Get all books
const getAllBooks = async (req, res, next) => {
  try {
    const data = await Book.find(); // Fetch all books from the database
    res.json({ books: data }); // Return books inside a 'books' key
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// Edit a book by ID
const updateBook = async (req, res, next) => {
  const { id } = req.params;
  const { title, author, genre, year, status } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, year, status },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully!",
      book: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a book by ID
const deleteBook = async (req, res, next) => {
  return res
    .status(200)
    .json({ success: true, message: "Book deleted successfully!" });
  const id = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Book deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
};
