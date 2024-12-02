const BorrowedBook = require("../models/borrowed.model");
const Book = require("../models/book.model");
const ReturnedBook = require("../models/returned.model");
const errorHandler = require("../utils/error");

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
      // Find the book by ID
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: `Book with ID ${bookId} not found` });
      }

      if (book.status === "Borrowed") {
        return res.status(400).json({ message: `Book "${book.title}" is already borrowed.` });
      }

      // Update the book's status to 'Borrowed'
      book.status = "Borrowed";
      await book.save();

      // Create a new borrowed book record with the necessary book details
      const borrowedBook = new BorrowedBook({
        bookId: book._id, // Store the book's ID as a reference
        title: book.title, // Pass the book's title
        author: book.author, // Pass the book's author
        pages: book.pages, // Pass the number of pages if available
        status: "Borrowed", // Book status is borrowed
        borrowDate: borrowDate, // Pass the borrow date from request body
        borrowerName: borrowerId, // Store borrower information (borrowerId or name)
        year: book.year, // Pass the book's year
      });

      // Save the borrowed book in the borrowed books collection
      await borrowedBook.save();
      borrowedBooks.push(borrowedBook);
    }

    // Return all borrowed book data as the response
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


const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { returnDate } = req.body; // Expecting returnDate in the body
    
    // Step 1: Find the borrowed book
    const borrowedBook = await BorrowedBook.findOne({ _id: bookId });
    if (!borrowedBook) {
      return res.status(404).json({ message: "Borrowed book not found." });
    }

    // Step 2: Create a returned book entry
    const returnedBook = new ReturnedBook({
      bookId: borrowedBook.bookId,
      title: borrowedBook.title,
      author: borrowedBook.author,
      borrowerName: borrowedBook.borrowerName,
      returnDate: returnDate || new Date(),
    });
    await returnedBook.save();

    // Step 3: Update the borrowed book status to "Returned"
    borrowedBook.status = 'Returned';
    borrowedBook.returnDate = returnDate || new Date();
    await borrowedBook.save();

    // Step 4: Update the book's status to "Available"
    const book = await Book.findById(borrowedBook.bookId);
    if (book) {
      book.status = "Available";
      await book.save();
    }

    // Step 5: Return response
    res.status(200).json({
      message: "Book returned successfully",
      returnedBook,
      updatedBook: borrowedBook,
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "An error occurred while returning the book." });
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
