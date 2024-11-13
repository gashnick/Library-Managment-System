const BorrowedBook = require("../models/borrowed.model");
const errorHandler = require("../utils/error");
const addBorrowedBook = async (req, res, next) => {
  try {
    const borrowedBook = new BorrowedBook(req.body);
    await borrowedBook.save();
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
