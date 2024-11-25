const BorrowedBook = require("../models/borrowed.model");
const Book = require("../models/book.model");
const ReturnedBook = require("../models/returned.model");
const errorHandler = require("../utils/error");

const addBorrowedBooks = async (req, res, next) => {
  try {
    const { books, borrowerId, borrowDate } = req.body;

    if (!books || !Array.isArray(books) || books.length === 0) {
      return res
        .status(400)
        .json({ message: "No books selected for borrowing." });
    }

    if (!borrowerId) {
      return res.status(400).json({ message: "Borrower ID is required." });
    }

    const borrowedBooks = []; // Array to store borrowed book records

    for (const bookId of books) {
      // Find the book by ID
      const book = await Book.findById(bookId);

      if (!book) {
        return res
          .status(404)
          .json({ message: `Book with ID ${bookId} not found` });
      }

      if (book.status === "Borrowed") {
        return res
          .status(400)
          .json({ message: `Book "${book.title}" is already borrowed.` });
      }

      // Update the book's status to 'Borrowed' and save borrower details
      book.status = "Borrowed";
      book.borrowerName = borrowerId; // Make sure you save borrowerId here
      book.borrowDate = borrowDate; // Save the provided borrowDate
      await book.save();

      // Create a new borrowed book record
      const borrowedBook = new BorrowedBook({
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        status: book.status,
        borrowerName: borrowerId, // Use the borrower's ID here
        borrowDate: borrowDate, // Ensure this is saved as a Date
      });

      // Save the borrowed book in the borrowed books collection
      await borrowedBook.save();
      borrowedBooks.push(borrowedBook);
    }

    // Return all borrowed book data as the response
    res
      .status(201)
      .json({ message: "Books borrowed successfully", borrowedBooks });
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
const updateMainBookStatus = async (bookId) => {
  try {
    // Find the main book in the main books table
    const book = await Book.findById(bookId);

    if (!book) {
      throw new Error("Book not found");
    }

    // Update the status of the main book to "Available"
    book.status = "Available";
    await book.save();

    return book;
  } catch (error) {
    throw error;
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
    const updatedBook = await updateMainBookStatus(borrowedBook._id);
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
  addBorrowedBooks,
  getBorrowedBook,
  returnBook,
  returnedBooks,
};
