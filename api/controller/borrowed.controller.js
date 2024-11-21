const BorrowedBook = require("../models/borrowed.model");
const Book = require("../models/book.model");
const errorHandler = require("../utils/error");
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

const returnABook = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Find and delete the borrowed book directly
    const borrowedBook = await BorrowedBook.findByIdAndDelete(id);

    if (borrowedBook) {
      res.status(200).json({ message: "Book returned successfully" });
    } else {
      next(errorHandler(404, "Book not found"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBorrowedBook,
  getBorrowedBook,
  returnABook,
};
