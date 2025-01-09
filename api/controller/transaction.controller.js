const Book = require("../models/book.model");
const Transaction = require("../models/transaction.model");

const issueBook = async (req, res, next) => {
  try {
    const { userId, bookIds, dueDate } = req.body; // bookIds is an array of book IDs

    // Check if the user has unreturned books
    const unreturnedBooks = await Transaction.find({
      userId,
      status: "Borrowed",
    });

    if (unreturnedBooks.length > 0) {
      return res.status(400).json({
        message: "You must return all borrowed books before borrowing new ones.",
      });
    }

    // Find books by IDs
    const books = await Book.find({ _id: { $in: bookIds } });

    // Check if all requested books exist
    if (books.length !== bookIds.length) {
      return res.status(404).json({
        message: "One or more books are not found.",
      });
    }

    // Array to store transactions
    const transactions = [];

    // Borrow logic for each book
    for (const book of books) {
      if (book.quantity > 0) {
        book.quantity -= 1;
        if (book.quantity === 0) {
          book.status = "Issued";
        }
        await book.save();

        // Create transaction for the borrowed book
        const transaction = new Transaction({
          bookId: book._id,
          userId,
          status: "Borrowed",
          borrowDate: new Date(),
          returnDate: dueDate,
        });
        transactions.push(transaction);
      } else {
        return res.status(400).json({
          message: `No copies available for the book "${book.title}".`,
        });
      }
    }

    // Save all transactions at once
    await Transaction.insertMany(transactions);

    res.status(200).json({
      message: "Books borrowed successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


const returnBook = async (req, res) => {
  const { bookId } = req.params; // The book ID from the URL parameter
  const { borrowerId } = req.body; // The borrower's ID from the request body

  try {
    // Find the transaction for the borrowed book
    const transaction = await Transaction.findOne({ bookId, userId: borrowerId });
    //console.log("Book ID:", bookId);
    //console.log("Borrower ID:", borrowerId);

    // Check if the transaction exists and if the book is currently borrowed
    if (!transaction) {
      return res.status(404).json({ message: 'No borrowed book found for this user.' });
    }

    if (transaction.status !== 'Borrowed') {
      return res.status(400).json({ message: 'This book is not currently borrowed.' });
    }

    // Update the transaction status to 'Returned'
    transaction.status = 'Returned';
    await transaction.save();

    // Update the book's status to 'Available' if needed
    const book = await Book.findById(bookId);
    if (book) {
      book.quantity += 1;
      if (book.quantity > 0) {
        book.status = "Available";
      } else {
        book.status = "Unavailable";
      }
      await book.save();
    }

    return res.status(200).json({ message: 'Book returned successfully!' });

  } catch (error) {
    console.error("Error in returnBook:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


const findBook = async (req, res, next) => {
  const filter = req.query;

  try {
    let transactions = await Transaction.find()
      .populate("bookId", "title") // Populate book title
      .populate("userId", "username"); // Populate userId with username

    if (filter.username) {
      transactions = transactions.filter(
        (transaction) => transaction.userId?.username.toLowerCase() === filter.username.toLowerCase()
      );
    }
    if (filter.bookTitle) {
      transactions = transactions.filter(
        (transaction) => transaction.bookId?.title.toLowerCase() === filter.bookTitle.toLowerCase()
      );
    }
    if (filter.status) {
      transactions = transactions.filter(
        (transaction) => transaction.status === filter.status
      );
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      transactions = transactions.filter((transaction) => {
        const book = transaction.bookId;
        const user = transaction.userId;
        return (
          (book &&
            Object.values(book).some(
              (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchTerm)
            )) ||
          (user &&
            Object.values(user).some(
              (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchTerm)
            ))
        );
      });
    }

    const books = transactions.map((transaction) => ({
      _id: transaction.bookId?._id || "N/A",
      title: transaction.bookId?.title || "N/A",
      borrower: transaction.userId?.username || "N/A", // Ensure the username is correctly populated
      status: transaction.status,
      borrowerId: transaction.userId?._id || null // Include the borrowerId
    }));

    if (books.length > 0) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "No books found matching the search criteria" });
    }
  } catch (error) {
    console.error("Error in findBook:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
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

module.exports = {
  issueBook,
  returnBook,
  getTransactions,
  findBook,
};
