import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { fetchBooks, deleteBook } from "../book/apiService";

export default function DisplayBooks() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedBook, setSelectedBook] = useState(null); // State to manage selected book
  const navigate = useNavigate();

  useEffect(() => {
    const getBooks = async () => {
      const response = await fetchBooks();
      if (response.success) {
        setBooks(response.books);
      }
    };

    getBooks();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedBooks = books.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRowClick = (book) => {
    setSelectedBook({ ...book }); // Select a book and display details in input fields
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleEdit = (book) => {
    console.log("Edit book:", book);
    navigate(`/dashboard/edit-book/${book._id}`);
  };

  const handleDelete = async (book) => {
    try {
      setBooks((prevBooks) => prevBooks.filter((b) => b._id !== book._id));
      await deleteBook(book._id);
      alert("Book deleted successfully");
    } catch (error) {
      console.error("Failed to delete book", error);
      alert("Failed to delete book. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* Table displaying books */}
      <div style={{ flex: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="books table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Author</TableCell>
                <TableCell align="right">Year</TableCell>
                <TableCell align="right">Pages</TableCell>
                <TableCell align="right">Quantity</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedBooks.map((book) => (
                <TableRow
                  key={book._id}
                  onClick={() => handleRowClick(book)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{book.title}</TableCell>
                  <TableCell align="right">{book.author}</TableCell>
                  <TableCell align="right">{book.year}</TableCell>
                  <TableCell align="right">{book.pages}</TableCell>
                  <TableCell align="right">{book.quantity}</TableCell>
                </TableRow>
              ))}
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

      {/* Book details form */}
      <div
        style={{ flex: 1, paddingLeft: "20px", borderLeft: "1px solid #ccc" }}
      >
        {selectedBook ? (
          <div>
            <h3>Book Details</h3>

            {/* Input fields displaying book details */}
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={selectedBook.title}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Author"
              name="author"
              value={selectedBook.author}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Year"
              name="year"
              type="number"
              value={selectedBook.year}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Pages"
              name="pages"
              type="number"
              value={selectedBook.pages}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quantity"
              name="quantity"
              type="number"
              value={selectedBook.quantity}
              onChange={handleInputChange}
            />

            {/* Edit and Delete buttons */}
            <div className="flex gap-2 mt-4">
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(selectedBook)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(selectedBook)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p>Click on a row to see book details</p>
        )}
      </div>
    </div>
  );
}
