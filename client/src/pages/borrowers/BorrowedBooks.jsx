import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]); // Initialize the books state

  // Handle returning a borrowed book
  const handleReturn = async (bookId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/borrowedbooks/return/${bookId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ returnDate: new Date().toISOString() }), // Include returnDate
        }
      );
  
      if (response.ok) {
        const { updatedBook, returnedBook } = await response.json(); // Destructure API response
        console.log("Book returned successfully:", { updatedBook, returnedBook });
  
        // Update the BorrowedBooks state
        setBorrowedBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId) // Remove returned book from borrowed list
        );
  
        // Call the backend route to update the book's status in the Books collection
        await fetch(`http://localhost:3000/api/book/status/${bookId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Available" }),
        });
  
        // Update the local Books state
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === bookId
              ? { ...book, status: "Available" } // Mark as available
              : book
          )
        );
  
        // Optionally, log or display returnedBook details if needed
        console.log("Returned book entry created:", returnedBook);
      } else {
        const errorData = await response.json();
        console.error("Failed to return book:", errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error returning book:", error.message || error);
      alert("An unexpected error occurred.");
    }
  };

  // Fetch borrowed books
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/borrowedbooks/getborrowed"
        );
        if (response.ok) {
          const data = await response.json();
          setBorrowedBooks(data);
        } else {
          console.error("Failed to fetch borrowed books:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    };
    fetchBorrowedBooks();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "author", headerName: "Author", width: 150 },
    { field: "genre", headerName: "Genre", width: 130 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "borrowerName", headerName: "Borrower Name", width: 150 },
    { field: "borrowDate", headerName: "Borrow Date", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <button
          onClick={() => handleReturn(params.row._id)}
          className="bg-red-500 text-white rounded text-sm px-4 py-2"
        >
          Return
        </button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">Borrowed Books</h2>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={borrowedBooks.map((book, index) => ({
            ...book,
            id: book._id || index, // Use MongoDB _id as unique id
          }))}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection={false}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
