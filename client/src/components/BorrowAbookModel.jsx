import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function BorrowAbookModal({
  open,
  onClose,
  books,
  borrowers,
  onBorrow,
}) {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState("");

  useEffect(() => {
    if (books && books.length > 0 && !selectedBook) {
      setSelectedBook(books[0].id);
    }
    if (borrowers && borrowers.length > 0 && !selectedBorrower) {
      setSelectedBorrower(borrowers[0].id);
    }
  }, [books, borrowers, selectedBook, selectedBorrower]);

  const handleBorrow = async () => {
    const book = books.find((b) => b.id === selectedBook);
    const borrower = borrowers.find((b) => b.id === selectedBorrower);

    if (book && borrower) {
      const borrowedBookData = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        borrowerName: borrower.name,
        borrowDate: new Date().toISOString(),
      };

      try {
        // Save borrowed book
        const saveResponse = await fetch("/api/borrowedbooks/addborrowed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(borrowedBookData),
        });

        if (!saveResponse.ok) throw new Error("Failed to save borrowed book.");

        // Update book status
        const statusResponse = await fetch(
          "http://localhost:3000/api/status/update-status",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId: book.id, status: "Borrowed" }),
          }
        );

        if (!statusResponse.ok)
          throw new Error("Failed to update book status.");

        // Trigger parent callback and close modal
        onBorrow(book, borrower);
        onClose();
      } catch (error) {
        console.error("Error handling borrow:", error.message);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="borrow-book-modal">
      <Box sx={modalStyle}>
        <h2 id="borrow-book-modal-title">Borrow a Book</h2>

        {/* Book selection dropdown */}
        <TextField
          select
          label="Select Book"
          fullWidth
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          margin="normal"
        >
          {books.map((book) => (
            <MenuItem key={book.id} value={book.id}>
              {book.title || "Unknown Title"}
            </MenuItem>
          ))}
        </TextField>

        {/* Borrower selection dropdown */}
        <TextField
          select
          label="Select Borrower"
          fullWidth
          value={selectedBorrower}
          onChange={(e) => setSelectedBorrower(e.target.value)}
          margin="normal"
        >
          {borrowers.map((borrower) => (
            <MenuItem key={borrower.id} value={borrower.id}>
              {borrower.name || "Unknown Borrower"}
            </MenuItem>
          ))}
        </TextField>

        {/* Confirm Borrow Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleBorrow}
          disabled={!selectedBook || !selectedBorrower}
          sx={{ mt: 2 }}
        >
          Confirm Borrow
        </Button>
      </Box>
    </Modal>
  );
}
