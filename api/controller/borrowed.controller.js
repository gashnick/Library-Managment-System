const BorrowedBook = require("../models/borrowed.model");
const Book = require("../models/book.model");
const ReturnedBook = require("../models/returned.model");
const mongoose = require('mongoose')
const errorHandler = require("../utils/error");
const BookCopy = require('../models/copy.book.model');

const addBorrowedBooks = async (req, res, next) => {
  try {
    const { books, borrowerId, borrowDate } = req.body;

    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "No books selected for borrowing." });
    }

    if (!borrowerId) {
      return res.status(400).json({ message: "Borrower ID is required." });
    }

    if (!borrowDate) {
      return res.status(400).json({ message: "Borrow date is required." });
    }

    const borrowedBooks = []; // Array to store borrowed book records

    for (const bookId of books) {
      // Find the first available copy of the book
      const availableCopy = await BookCopy.findOne({ bookId, status: "Available" });

      if (!availableCopy) {
        return res.status(400).json({ message: `No available copies for book with ID ${bookId}.` });
      }

      // Update the status of the copy to "Borrowed"
      availableCopy.status = "Borrowed";
      await availableCopy.save();

      // Find the book details
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${bookId} not found` });
      }

      // Update the borrowedCopies count in the Book collection
      book.borrowedCopies += 1;

      // Recalculate remainingCopies
      book.remainingCopies = book.copies - book.borrowedCopies;
      await book.save();

      // Create a new borrowed book record with the necessary details
      const borrowedBook = new BorrowedBook({
        bookId: book._id, // Store the book's ID as a reference
        title: book.title, // Pass the book's title
        author: book.author, // Pass the book's author
        pages: book.pages, // Pass the number of pages if available
        status: "Borrowed", // Book status is borrowed
        borrowDate: borrowDate, // Pass the borrow date from request body
        borrowerName: borrowerId, // Store borrower information
        year: book.year, // Pass the book's year
      });

      // Save the borrowed book record
      await borrowedBook.save();
      borrowedBooks.push(borrowedBook);
    }

    // Return success response
    res.status(201).json({ message: "Books borrowed successfully", borrowedBooks });
  } catch (error) {
    next(error);
  }
};


const getBorrowedBook = async (req, res, next) => {
  try {
    // Fetch all borrowed books
    const borrowedBooks = await BorrowedBook.find();

    // Extract bookIds from borrowed books
    const bookIds = borrowedBooks.map(borrowedBook => borrowedBook.bookId);

    // Fetch the full book details for each bookId
    const books = await Book.find({ _id: { $in: bookIds } });

    // Check if books were found
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found in the system." });
    }

    // Merge borrowed book data with corresponding book details
    const borrowedBooksWithDetails = borrowedBooks.map(borrowedBook => {
      const bookDetails = books.find(book => {
        // Check if bookId and _id are defined before comparing
        if (borrowedBook.bookId && book._id) {
          return borrowedBook.bookId.toString() === book._id.toString();
        }
        return false;
      });

      if (!bookDetails) {
        // Handle missing book details, e.g., log an error or return a specific message
        console.error(`Book details not found for borrowed book ID: ${borrowedBook.bookId}`);
        return { ...borrowedBook.toObject(), message: "Book details not found" };
      }

      return { ...borrowedBook.toObject(), ...bookDetails.toObject() };
    });

    res.json(borrowedBooksWithDetails);
  } catch (error) {
    next(error);
  }
};


const returnBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { returnDate } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required." });
    }

    if (!returnDate) {
      return res.status(400).json({ message: "Return date is required." });
    }

    // Find the borrowed book record
    const borrowedBook = await BorrowedBook.findOne({ bookId, status: "Borrowed" });

    if (!borrowedBook) {
      return res.status(404).json({ message: `No borrowed book found with ID ${bookId}.` });
    }

    // Update the borrowed book status to "Returned"
    borrowedBook.status = "Returned";
    borrowedBook.returnDate = returnDate;
    await borrowedBook.save();

    // Find and update the book copy's status to "Available"
    const bookCopy = await BookCopy.findOne({ bookId, status: "Borrowed" });
    if (!bookCopy) {
      return res.status(404).json({ message: `No borrowed copy found for book with ID ${bookId}.` });
    }

    bookCopy.status = "Available";
    await bookCopy.save();

    // Update the borrowedCopies count in the Book collection
    const book = await Book.findById(bookId);
    if (book) {
      book.borrowedCopies -= 1;

      // Recalculate the remainingCopies
      book.remainingCopies = book.copies - book.borrowedCopies;
      await book.save();
    }

    res.status(200).json({ message: "Book returned successfully", borrowedBook });
  } catch (error) {
    next(error);
  }
};




const returnedBooks = async (req, res, next) => {
  try {
    const returned = await ReturnedBook.find(); // Correctly fetches all returned books
    res.json(returned); // Sends the returned books as a JSON response
  } catch (error) {
    next(error); // Passes any errors to the next middleware (error handling)
  }
};


module.exports = {
  addBorrowedBooks,
  getBorrowedBook,
  returnBook,
  returnedBooks,
};
