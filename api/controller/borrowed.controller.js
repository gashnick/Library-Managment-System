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
    const { title, author, year, borrowerName, returnDate } = req.body;

    // Find the borrowed book to update its status
    const borrowedBook = await BorrowedBook.findOne({
      title,
      author,
      year,
      status: "Borrowed",
    });

    if (!borrowedBook) {
      return res.status(404).json({ message: "Borrowed book not found" });
    }

    // Update the borrowed book's status to 'Returned' and set return details
    borrowedBook.status = "Returned";
    borrowedBook.returnDate = returnDate;
    await borrowedBook.save();

    // Find the main book in the catalog to mark it as 'Available'
    const book = await Book.findOne({ title, author, year });

    if (!book) {
      return res.status(404).json({ message: "Book not found in catalog" });
    }

    // Update the main book's status to 'Available'
    book.status = "Available";
    await book.save();

    // Create a new record in the 'ReturnedBooks' collection for history tracking
    const returnedBook = new ReturnedBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      borrowerName,
      returnDate,
      status: "Returned", // Explicitly include the 'Returned' status here
    });

    await returnedBook.save();

    // Respond with the returned book details
    res.status(200).json({
      message: "Book returned successfully",
      returnedBook: {
        title: returnedBook.title,
        author: returnedBook.author,
        genre: returnedBook.genre,
        year: returnedBook.year,
        borrowerName: returnedBook.borrowerName,
        returnDate: returnedBook.returnDate,
        status: returnedBook.status, // Include the returned status explicitly
      },
    });
  } catch (error) {
    next(error);
  }
};

const returnedBooks = async (req, res, next) => {
  try {
    const retruned = await ReturnedBook.find();
    res.json(retruned);
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
