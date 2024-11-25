import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function ReturnedBook() {
  const [returnedBooks, setReturnedBooks] = useState([]);

  // Fetch returned books
  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/borrowedbooks/returned"
        );
        if (response.ok) {
          const data = await response.json();
          setReturnedBooks(data);
        } else {
          console.error("Failed to fetch returned books:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching returned books:", error);
      }
    };
    fetchReturnedBooks();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "author", headerName: "Author", width: 150 },
    { field: "genre", headerName: "Genre", width: 130 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "borrowerName", headerName: "Borrower Name", width: 150 },
    { field: "returnDate", headerName: "Return Date", width: 130 }, // Ensure correct field name
    { field: "status", headerName: "Status", width: 100 },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">Returned Books</h2>
      <Paper sx={{ height: 400, width: "100%" }}>
        {returnedBooks.length === 0 ? (
          <p>No returned books available.</p>
        ) : (
          <DataGrid
            rows={returnedBooks.map((book, index) => ({
              ...book,
              id: book._id || index, // Use MongoDB _id or fallback to index
            }))}
            columns={columns}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
            sx={{ border: 0 }}
          />
        )}
      </Paper>
    </div>
  );
}
