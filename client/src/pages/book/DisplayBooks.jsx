import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const columns = (handleDelete, handleBorrowClick) => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "author", headerName: "Author", width: 150 },
  { field: "genre", headerName: "Genre", width: 130 },
  { field: "year", headerName: "Year", width: 100 },
  { field: "status", headerName: "Status", width: 100 },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => (
      <div className="gap-2">
        <button
          variant="contained"
          color="primary"
          size="small"
          className="text-white text-sm rounded-sm mr-2 bg-green-700 p-1"
        >
          Edit
        </button>
        <button
          variant="contained"
          color="primary"
          size="small"
          className="rounded-sm text-sm text-white bg-red-700 p-1"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </button>

        <button
          variant="contained"
          color="primary"
          size="small"
          className="rounded-sm text-sm text-white bg-blue-700 p-1 ml-1"
          onClick={() => handleBorrowClick(params.row)}
        >
          Borrow
        </button>
      </div>
    ),
  },
];

export default function DisplayBooks() {
  const [rows, setRows] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [selectedBorrower, setSelectedBorrower] = useState(null); // Change to object
  const [openModal, setOpenModal] = useState(false); // State to handle modal visibility
  const [selectedBook, setSelectedBook] = useState(null); // State to hold the selected book

  // Fetch books and borrowers from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await fetch("/book.json"); // Assuming books are still in a static file or from backend
        const booksData = await booksResponse.json();
        const books = booksData.response.books.map((book, index) => ({
          id: book.id || index,
          title: book.title || "N/A",
          author: book.author || "Unknown",
          genre: book.categories || "General",
          year: book.year || "N/A",
          status: "Available",
        }));
        setRows(books);

        const borrowersResponse = await fetch("/api/borrower/borrowers"); // Update with actual API endpoint
        const borrowersData = await borrowersResponse.json();

        // Ensure borrowersData is an array
        if (Array.isArray(borrowersData)) {
          setBorrowers(borrowersData);
        } else {
          console.error("Borrowers data is not an array:", borrowersData);
          setBorrowers([]); // Set to empty array if data is not an array
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setBorrowers([]); // Set to empty array in case of an error
      }
    };

    fetchData();
  }, []);

  // Handle borrow button click
  const handleBorrowClick = (book) => {
    setSelectedBook(book); // Store the selected book
    setOpenModal(true); // Open the modal to select a borrower
  };

  // Handle borrow action in the modal
  const handleBorrow = () => {
    if (!selectedBorrower) {
      alert("Please select a borrower.");
      return;
    }

    if (borrowedBooks.some((b) => b.id === selectedBook.id)) {
      alert("This book is already borrowed.");
      return;
    }

    const borrowedBook = {
      ...selectedBook,
      borrower: selectedBorrower.name, // Use the name from the object
      borrowDate: new Date().toLocaleDateString(),
    };
    setBorrowedBooks((prev) => [...prev, borrowedBook]);
    alert(
      `You have borrowed "${selectedBook.title}" for ${selectedBorrower.name}`
    );
    setOpenModal(false); // Close the modal after borrowing the book
  };

  // Handle delete action
  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold mb-5">ALL BOOKS</h1>
        <span>
          <Link to={"/dashboard/create"}>
            <button className="rounded-lg p-3 text-white bg-slate-700">
              Create a new book
            </button>
          </Link>
        </span>
      </div>

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns(handleDelete, handleBorrowClick)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection={false}
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Modal for Borrowing Book */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Select Borrower</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Borrower</InputLabel>
            <Select
              value={selectedBorrower ? selectedBorrower.id : ""}
              onChange={(e) =>
                setSelectedBorrower(
                  borrowers.find((b) => b.id === e.target.value)
                )
              }
              label="Borrower"
            >
              <MenuItem value="">Select Borrower</MenuItem>
              {borrowers.map((borrower) => (
                <MenuItem key={borrower.id} value={borrower.id}>
                  {borrower.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBorrow} color="primary">
            Borrow
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
