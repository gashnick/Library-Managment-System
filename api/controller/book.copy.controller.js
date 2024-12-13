const BookCopy = require("../models/copy.book.model");
const errorHandler = require("../utils/error");

const getCopy = async (req, res, next) => {
  try {
    const copies = await BookCopy.find();
    res.json(copies);
  } catch (error) {
    next(errorHandler(404, "Book copies not found"));
  }
};

const borrowBook = async (req, res, next) => {
  try {
    const { userId, bookIds } = req.body;

    // Validate input
    if (!userId || !bookIds || !bookIds.length) {
      return res
        .status(400)
        .json({ error: "Missing required fields (userId, bookIds)" });
    }

    // Find available copies and update their status
    const updatedCopies = await BookCopy.updateMany(
      { _id: { $in: bookIds }, status: "Available" },
      {
        $set: {
          status: "Borrowed",
          borrower: { userId, name: "User Name", contact: "User Contact" }, // Replace with actual user details
          borrowDate: new Date(),
        },
      },
      { new: true }
    );

    if (updatedCopies.modifiedCount === bookIds.length) {
      return res.status(200).json({ message: "Books borrowed successfully" });
    } else {
      const unavailableBookIds = bookIds.filter(
        (id) => !updatedCopies.some((copy) => copy._id.equals(id))
      );
      return res.status(400).json({
        error: `Books with IDs ${unavailableBookIds} are not available`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error borrowing books" });
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const updatedBookCopy = await BookCopy.findOneAndUpdate(
      { _id: bookId, status: "Borrowed" },
      { status: "Available", returnDate: new Date() }
    );

    if (!updatedBookCopy) {
      return res
        .status(404)
        .json({ error: "Book copy not found or not borrowed" });
    }

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error returning book" });
  }
};

module.exports = {
  getCopy,
  borrowBook,
  returnBook,
};
