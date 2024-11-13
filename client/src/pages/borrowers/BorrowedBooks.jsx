import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Handle returning a borrowed book
  const handleReturn = async (bookId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/borrowedbooks/return/${bookId}`,
        {
          method: "PUT",
        }
      );
      console.log(response);
      if (response.ok) {
        console.log("Book returned successfully");
        setBorrowedBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId)
        );
      } else {
        console.error("Failed to return book:", response.statusText);
      }
    } catch (error) {
      console.error("Error returning book:", error);
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
