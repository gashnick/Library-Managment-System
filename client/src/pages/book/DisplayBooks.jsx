import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import { fetchBooks, deleteBook } from "./apiService"; // Adjust path to match your structure
import BookComponent from "../borrowers/BookComponent";

export default function DisplayBooks() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedBook, setSelectedBook] = useState(null); // To keep track of the selected book for borrowing
  const [openModal, setOpenModal] = useState(false); // To control the modal visibility
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const getBooks = async () => {
      const fetchedBooks = await fetchBooks();
      setBooks(fetchedBooks);
    };

    getBooks();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const paginatedBooks = books.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEdit = (book) => {
    console.log("Edit book:", book);
    navigate(`/dashboard/edit-book/${book._id}`); // Programmatically navigate to the edit page
  };
  const handleDelete = async (book) => {
    try {
      console.log("Deleting book with ID:", book._id);

      // Optimistic update
      setBooks((prevBooks) => prevBooks.filter((b) => b._id !== book._id));

      await deleteBook(book._id);

      // Server-side confirmation
      alert("Book deleted successfully");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again later.");
    }
  };
  const handleBookBorrowed = (borrowedBook) => {
    // Update the book's status to 'Borrowed' and refresh the state
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === borrowedBook._id ? { ...book, status: "Borrowed" } : book
      )
    );
    setOpenModal(false); // Close the modal after borrowing
  };
  const handleBorrow = (book) => {
    setSelectedBook(book); // Set the selected book
    setOpenModal(true); // Open the modal when the Borrow button is clicked
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="books table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Author</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Pages</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell align="right">{book.author}</TableCell>
                  <TableCell align="right">{book.year}</TableCell>
                  <TableCell align="right">{book.pages}</TableCell>
                  <TableCell align="right">{book.status}</TableCell>
                  <TableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(book)} // Trigger edit action
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(book)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleBorrow(book)} // When clicked, it will open the modal
                      >
                        Borrow
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No books available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={books.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* BookComponent Modal will appear here when a book is selected for borrowing */}
      {selectedBook && openModal && (
        <BookComponent
          book={selectedBook}
          onBorrow={() => handleBookBorrowed(selectedBook)} // Borrow handler
        />
      )}
    </div>
  );
}
