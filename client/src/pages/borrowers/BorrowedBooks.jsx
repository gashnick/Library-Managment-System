import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "author", headerName: "Author", width: 150 },
  { field: "genre", headerName: "Genre", width: 130 },
  { field: "year", headerName: "Year", width: 100 },
  { field: "borrowerName", headerName: "Borrower Name", width: 150 },
  { field: "borrowDate", headerName: "Borrow Date", width: 130 },
];

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    // Fetch borrowed books from localStorage
    const storedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    console.log(storedBooks); // Log to inspect the structure if needed
    setBorrowedBooks(storedBooks);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">Borrowed Books</h2>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={borrowedBooks.map((book, index) => ({
            ...book,
            id: book.id || index, // Ensure each row has a unique id
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
