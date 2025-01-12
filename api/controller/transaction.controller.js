const Book = require("../models/book.model");
const Transaction = require("../models/transaction.model");

const issueBook = async (req, res, next) => {
  try {
    const { userId, bookIds, dueDate } = req.body; // bookIds is an array of book IDs

    // Check if the user has unreturned books
    const activeBorrowedBooks = await Transaction.aggregate([
      { $match: { userId, status: "Borrowed" } }, // Find all borrowed books for the user
      {
        $lookup: {
          from: "transactions", // Join with the same collection
          localField: "bookId",
          foreignField: "bookId",
          as: "relatedTransactions",
        },
      },
      {
        $match: {
          "relatedTransactions.status": { $ne: "Returned" }, // Ensure no "Returned" transaction exists for the same bookId
        },
      },
    ]);

    if (activeBorrowedBooks.length > 0) {
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
    // Find the most recent "Borrowed" transaction for this book and user
    const lastTransaction = await Transaction.findOne({ bookId, userId: borrowerId, status: "Borrowed" })
      .sort({ createdAt: -1 }); // Get the latest borrow transaction

    // Check if the transaction exists
    if (!lastTransaction) {
      return res.status(404).json({ message: 'No active borrowed book found for this user.' });
    }

    // Prevent duplicate returns by checking if the book is already returned
    const existingReturnTransaction = await Transaction.findOne({
      bookId,
      userId: borrowerId,
      status: "Returned",
      returnDate: { $gte: lastTransaction.borrowDate }, // Return date must be after borrow date
    });

    if (existingReturnTransaction) {
      return res.status(400).json({ message: 'This book has already been returned.' });
    }

    // Update the book's quantity and status
    const book = await Book.findById(bookId);
    if (book) {
      book.quantity += 1; // Increment the quantity
      book.status = book.quantity > 0 ? "Available" : "Unavailable"; // Update status based on quantity
      await book.save();
    }

    // Create a new transaction for the returned book
    const returnTransaction = new Transaction({
      bookId,
      userId: borrowerId,
      status: "Returned",
      borrowDate: lastTransaction.borrowDate, // Link to the borrow transaction
      returnDate: new Date(),
    });
    await returnTransaction.save();

    return res.status(200).json({ message: 'Book returned successfully!', returnTransaction });

  } catch (error) {
    console.error("Error in returnBook:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};




const findBook = async (req, res, next) => {
  const { bookTitle } = req.query; // Extract the book title filter from the query params

  try {
    // Find all "Borrowed" transactions without a corresponding "Returned" transaction
    const borrowedTransactions = await Transaction.aggregate([
      {
        $match: { status: "Borrowed" }, // Match only "Borrowed" status
      },
      {
        $lookup: {
          from: "transactions", // Lookup in the transactions collection
          let: { bookId: "$bookId", userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$bookId", "$$bookId"] },
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$status", "Returned"] },
                  ],
                },
              },
            },
          ],
          as: "returnedRecords", // Save matching returned transactions here
        },
      },
      {
        $match: { returnedRecords: { $size: 0 } }, // Keep only "Borrowed" transactions without "Returned" records
      },
      {
        $lookup: {
          from: "books", // Lookup book details
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book", // Deconstruct the book array
      },
      {
        $project: {
          _id: "$book._id",
          title: "$book.title",
          borrower: "$userId", // User who borrowed the book
          status: "$status",
        },
      },
    ]);

    // Apply filtering by book title if provided
    const filteredBooks = bookTitle
      ? borrowedTransactions.filter((transaction) =>
          transaction.title.toLowerCase().includes(bookTitle.toLowerCase())
        )
      : borrowedTransactions;

    // Map the filtered transactions to the desired structure
    const books = filteredBooks.map((transaction) => ({
      _id: transaction._id || "N/A", // The book ID
      title: transaction.title || "N/A", // The book title
      borrower: transaction.borrower?.username || "N/A", // The username of the borrower
      status: transaction.status,
      borrowerId: transaction.borrower?._id || null, // The borrower's ID
    }));

    if (books.length > 0) {
      return res.status(200).json(books);
    } else {
      return res
        .status(404)
        .json({ message: "No books found matching the search criteria." });
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
