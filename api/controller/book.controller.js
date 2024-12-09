const Book = require("../models/book.model");
const BookCopy = require('../models/copy.book.model')
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
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    next(errorHandler(404, "Error fetching books"));
  }
};

const updateBookStatus = async (req, res, next) => {
  const { id } = req.params; // Book ID from URL
  const { status } = req.body; // New status from the request body

  try {
    // Find the book by ID
    const book = await Book.findById(id);

    // If the book doesn't exist, return a 404 error
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update the book's status
    book.status = status;

    // Save the updated book to the database
    const updatedBook = await book.save();

    // Return a success response with the updated book details
    return res.status(202).json({
      message: "Book status updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    // Handle unexpected errors gracefully
    next(error);
  }
};

// Edit a book by ID
const updateBook = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body; // We get all the properties to update from the request body

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updates, // Pass the whole request body for updating
      { new: true, runValidators: true } // Ensure updated book is returned and run validation
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully!",
      book: updatedBook,
    });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Delete a book by ID
const deleteBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(202).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deletind a book" });
  }
};
const bookId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const fetchBookCopies = async (req, res,next) => { 
  try {
    const copies = await BookCopy.find()
    res.json(copies)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch book copies"))
  }
 
}

const machedCopies = async (req, res, next) => {
  try {
    const books = await Book.find();
    const copies = await BookCopy.find();
    const bookWithCopies = books.map(book => {
      const availbaleCopies = copies.filter(coppy => coppy.bookId.toString() === book._id.toString() && coppy.status === 'Available');
      return {
        ...book.toString(),
        availbaleCopies
      }
    })
    res.json(bookWithCopies)
  } catch (error) {
    
  }
}

module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  updateBookStatus,
  bookId,
  fetchBookCopies,
};
