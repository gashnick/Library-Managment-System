
const Book = require("../models/book.model");

async function updateBooks() {
  await Book.updateMany({}, { $set: { copies: 1, availableCopies: 1 } });
  console.log("Books updated successfully");
}

updateBooks();
