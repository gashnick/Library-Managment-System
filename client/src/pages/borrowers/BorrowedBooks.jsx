import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Handle returning a borrowed book
  const handleReturn = async (bookId) => {
    try {
      if (!bookId) {
        alert("Book ID is required.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/borrowedbooks/return/${bookId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ returnDate: new Date().toISOString() }),
        }
      );

      if (response.ok) {
        const { returnedBook } = await response.json();
        console.log("Book returned successfully:", returnedBook);

        setBorrowedBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId)
        );
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
    { field: "year", headerName: "Year", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "borrowerName", headerName: "Borrower Name", width: 150 },
    {
      field: "borrowDate",
      headerName: "Borrow Date",
      width: 130,
      renderCell: (params) => new Date(params.row.borrowDate).toLocaleDateString(),
    },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <button
          onClick={() => handleReturn(params.row.id)}
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
          rows={borrowedBooks
            .filter((book) => book._id) // Filter out books with missing `_id`
            .map((book) => ({
              id: book._id, // Use only MongoDB `_id` as the unique key
              title: book.title || "N/A",
              author: book.author || "N/A",
              year: book.year || "Unknown",
              status: book.status || "Unknown",
              borrowerName: book.borrowerName || "Unknown",
              borrowDate: book.borrowDate || new Date().toISOString(),
            }))}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
          checkboxSelection={false}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
