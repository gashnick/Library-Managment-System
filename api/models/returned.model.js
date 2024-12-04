const mongoose = require('mongoose');

const ReturnedBookSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowerName: { type: String, required: true },
    returnDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ReturnedBook", ReturnedBookSchema);