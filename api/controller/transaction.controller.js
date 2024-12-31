const Book = require("../models/book.model");
const Transaction = require("../models/transaction.model");

const issueBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.body;

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

const returnBook = async (rq, res, next) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.quantity += 1;
    if (book.quantity > 0) {
      book.status = "Available";
    }
    await book.save();

    const transaction = await Transaction.findOneAndUpdate(
      { bookId, status: "Pending" },
      { status: "Returned", returnDate: new Date() },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res
      .status(200)
      .json({ message: "Book returned successfully", transaction });
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
  const { query } = req.query;
  try {
    const book = await Book.findOne({
      $or: [{ _id: query }, { title: query }],
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
module.exports = {
  issueBook,
  returnBook,
  getTransactions,
  findBook,
};
