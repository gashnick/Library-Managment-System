const BorrowedBook = require("../models/borrowed.model");
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

module.exports = {
  addBorrowedBook,
  getBorrowedBook,
};
