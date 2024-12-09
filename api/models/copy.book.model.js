const mongoose = require('mongoose');

// Define the book copy schema
const bookCopySchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, required: true, enum: ['Available', 'Borrowed'], default: "Available" },
});

// Create the model and specify the collection name
const BookCopy = mongoose.model('BookCopy', bookCopySchema, 'bookCopies'); // Explicitly specify 'bookCopies' as the collection name

module.exports = BookCopy;
