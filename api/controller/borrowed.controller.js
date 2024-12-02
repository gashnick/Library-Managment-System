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

      // Update the book's status to 'Borrowed'
      book.status = "Borrowed";
      book.borrowerName = borrowerId; // Use the borrower's ID here
      book.borrowDate = borrowDate; // Save the provided borrowDate
      await book.save();

      // Create a new borrowed book record with a reference to the Book
      const borrowedBook = new BorrowedBook({
        bookId: book._id, // Store the book's ID as a reference
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
    // Fetch all borrowed books
    const borrowedBooks = await BorrowedBook.find();

    // Extract bookIds from borrowed books
    const bookIds = borrowedBooks.map(borrowedBook => borrowedBook.bookId);

    // Fetch the full book details for each bookId
    const books = await Book.find({ _id: { $in: bookIds } });

    // Merge borrowed book data with corresponding book details
    const borrowedBooksWithDetails = borrowedBooks.map(borrowedBook => {
      const bookDetails = books.find(book => book._id.toString() === borrowedBook.bookId.toString());
      return { ...borrowedBook.toObject(), ...bookDetails.toObject() }; // Merge book details with borrowed book
    });

    res.json(borrowedBooksWithDetails);
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { id } = req.params; // BorrowedBook ID
    const returnDate = new Date(); // Set new return date

    // Step 1: Update BorrowedBook status to "Returned"
    const borrowedBook = await BorrowedBook.findByIdAndUpdate(
      id,
      { status: "Returned" }, // Update status only
      { new: true }
    );

    if (!borrowedBook) {
      return res.status(404).json({ message: "Borrowed book not found" });
    }

    // Step 2: Create an entry in the ReturnedBooks collection with the new return date
    const returnedBook = new ReturnedBook({
      title: borrowedBook.title,
      author: borrowedBook.author,
      genre: borrowedBook.genre,
      year: borrowedBook.year,
      status: "Returned",
      borrowerName: borrowedBook.borrowerName,
      returnDate, // Use the new date
    });

    await returnedBook.save();

    // Step 3: Update the main Books table status to "Available"
    const updatedBook = await Book.findByIdAndUpdate(
      borrowedBook.bookId, // Ensure this exists in BorrowedBook schema
      { status: "Available" }, // Update status
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Main book not found" });
    }

    // Step 4: Respond with success
    res.status(200).json({
      message: "Book returned successfully",
      updatedBook, // Updated main book
      returnedBook, // Entry in ReturnedBooks collection with new return date
    });
  } catch (error) {
    // Forward error to error-handling middleware
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
