const moongose = require("mongoose");
const BorrowedBook = require("../models/borrowed.model");
const Book = require("../models/book.model");
const ReturnedBook = require("../models/returned.model");
const errorHandler = require("../utils/error");
const { default: mongoose } = require("mongoose");
const addBorrowedBook = async (req, res, next) => {
  try {
    const { title, author, genre, year, borrowerName, borrowDate } = req.body;

    // Find the book to update its status
    const book = await Book.findOne({ title, author, year });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update the book's status to 'Borrowed' and save borrower details
    book.status = "Borrowed";
    book.borrowerName = borrowerName;
    book.borrowDate = borrowDate;

    await book.save();

    // Create a new borrowed book record (if needed)
    const borrowedBook = new BorrowedBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      status: book.status,
      borrowerName: book.borrowerName,
      borrowDate: book.borrowDate,
    });

    // Save the borrowed book in the borrowed books collection
    await borrowedBook.save();

    // Return the borrowed book data as the response
    res.status(201).json(borrowedBook);
  } catch (error) {
    next(error);
  }
};

const getBorrowedBook = async (req, res, next) => {
  try {
    const books = await BorrowedBook.find();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { returnDate } = req.body;

    // Fetch the borrowed book
    const borrowedBook = await BorrowedBook.findById(id);

    if (!borrowedBook || borrowedBook.status !== "Borrowed") {
      return res
        .status(404)
        .json({ message: "Borrowed book not found or already returned" });
    }

    // Update borrowed book status
    borrowedBook.status = "Returned";
    borrowedBook.returnDate = returnDate || new Date();
    await borrowedBook.save();

    // Create a returned book entry
    const returnedBook = new ReturnedBook({
      title: borrowedBook.title,
      author: borrowedBook.author,
      genre: borrowedBook.genre,
      year: borrowedBook.year,
      status: "Returned",
      borrowerName: borrowedBook.borrowerName,
      returnDate: borrowedBook.returnDate,
    });

    await returnedBook.save();

    res
      .status(200)
      .json({ message: "Book returned successfully", returnedBook });
  } catch (error) {
    next(error);
  }
};

const returnedBooks = async (req, res, next) => {
  try {
    const returned = await ReturnedBook.find(); // Corrected the typo here
    res.json(returned);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBorrowedBook,
  getBorrowedBook,
  returnBook,
  returnedBooks,
};
