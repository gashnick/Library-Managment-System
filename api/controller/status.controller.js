const Book = require("../models/book.model");
const errorHandler = require("../utils/error");

const updatedBookStatus = async (req, res, next) => {
  const { bookId, status } = req.body;

  if (!bookId || !status) {
    return res
      .status(400)
      .send("Invalid input: 'bookId' and 'status' are required.");
  }

  try {
    const result = await BookModel.updateOne({ id: bookId }, { status }); // Assuming MongoDB
    if (result.modifiedCount > 0) {
      res.send("Book status updated successfully");
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    console.error("Error updating book status:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = updatedBookStatus;
