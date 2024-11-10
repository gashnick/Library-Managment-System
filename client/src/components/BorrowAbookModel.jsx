// BorrowAbookModel.js

import React, { useState } from "react";
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

export default function BorrowAbookModel({
  open,
  onClose,
  books,
  borrowers,
  onBorrow,
}) {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState("");

  const handleBorrow = () => {
    if (selectedBook && selectedBorrower) {
      onBorrow(selectedBook, selectedBorrower);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="borrow-book-modal">
      <Box sx={modalStyle}>
        <h2 id="borrow-book-modal-title">Borrow a Book</h2>

        <TextField
          select
          label="Select Book"
          fullWidth
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          margin="normal"
        >
          {books.map((book) => (
            <MenuItem key={book.id} value={book}>
              {book.title}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select Borrower"
          fullWidth
          value={selectedBorrower}
          onChange={(e) => setSelectedBorrower(e.target.value)}
          margin="normal"
        >
          {borrowers.map((borrower) => (
            <MenuItem key={borrower.id} value={borrower}>
              {borrower.name}
            </MenuItem>
          ))}
        </TextField>

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
