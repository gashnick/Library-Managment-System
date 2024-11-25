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
import { fetchBooks, deleteBook } from "../book/apiService"; // Adjust path to match your structure
import BookStats from "../../components/BookStats";

export default function DisplayBooks() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  const handleBorrow = () => {
    navigate("/dashboard/borrow"); // Navigate to BorrowForm
  };

  return (
    <div>
      <div className="mb-2 justify-center items-center">
        <BookStats />
      </div>

      {/* Borrow Button at the Top */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={handleBorrow} // Navigate to borrow form
        >
          Borrow
        </Button>
      </div>

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
    </div>
  );
}
