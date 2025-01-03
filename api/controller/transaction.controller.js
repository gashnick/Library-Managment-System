const Book = require("../models/book.model");
const Transaction = require("../models/transaction.model");

const issueBook = async (req, res, next) => {
  try {
    const { userId, bookId, dueDate } = req.body; // Include dueDate in the destructuring

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.quantity > 0) {
      book.quantity -= 1;
      if (book.quantity === 0) {
        book.status = "Issued";
      }
      await book.save();

      const transaction = new Transaction({
        bookId,
        userId,
        status: "Pending",
        borrowDate: new Date(),
        returnDate: dueDate, // Store the dueDate as returnDate
      });
      await transaction.save();

      res
        .status(200)
        .json({ message: "Book borrowed successfully", transaction });
    } else {
      res.status(400).json({ message: "No copies available for borrowing" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


const returnBook = async (req, res, next) => {
  try {
    const { bookId } = req.params; // Get bookId from URL parameters

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Update book quantity and status
    book.quantity += 1;
    if (book.quantity > 0) {
      book.status = "Available";
    }
    await book.save();

    // Find the original transaction
    const originalTransaction = await Transaction.findOne({
      bookId,
      status: "Pending",
    });
    if (!originalTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Create a new transaction with updated status
    const newTransaction = new Transaction({
      bookId: originalTransaction.bookId,
      userId: originalTransaction.userId,
      status: "Returned",
      borrowDate: originalTransaction.borrowDate,
      returnDate: new Date(),
    });
    await newTransaction.save();

    // Return a success response
    res.status(200).json({
      message: "Book returned successfully",
      newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate("bookId", "title author")
      .populate("userId", "username");
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
const findBook = async (req, res, next) => {
  const filter = req.query;
  try {
    // Assuming you have a model called "Book" for MongoDB
    const books = await Book.find(); // Fetching all books from the database
    const filteredBooks = books.filter((book) => {
      let isValid = true;
      for (let key in filter) {
        console.log(`Filtering by ${key}: ${filter[key]}`);
        if (book[key] && typeof book[key] === 'string') {
          isValid = isValid && book[key].toLowerCase().includes(filter[key].toLowerCase());
        } else if (book[key] !== filter[key]) {
          isValid = false;
        }
      }
      return isValid;
    });

    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found matching the search criteria" });
    }

    res.status(200).json(filteredBooks);
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



module.exports = {
  issueBook,
  returnBook,
  getTransactions,
  findBook,
};
