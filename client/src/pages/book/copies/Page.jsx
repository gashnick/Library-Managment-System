import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { fetchCopies } from "../apiService"; // Import the fetchCopies function

export default function Page() {
  const [bookCopies, setBookCopies] = useState([]);

  // Fetch book copies data using fetchCopies function
  useEffect(() => {
    const loadBookCopies = async () => {
      try {
        const copies = await fetchCopies(); // Assuming fetchCopies returns an array of copies
        setBookCopies(copies);
      } catch (error) {
        console.error("Error fetching book copies:", error);
      }
    };

    loadBookCopies();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Book ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Borrower Name</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Borrow Date</TableCell>
            <TableCell>Return Date</TableCell>
            <TableCell align="right">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookCopies.map((copy) => (
            <TableRow
              key={copy._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{copy.bookId || "Unknown"}</TableCell>
              <TableCell>{copy.status}</TableCell>
              <TableCell>{copy.borrower?.name || "N/A"}</TableCell>
              <TableCell>{copy.borrower?.contact || "N/A"}</TableCell>
              <TableCell>
                {copy.borrowDate
                  ? new Date(copy.borrowDate).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                {copy.returnDate
                  ? new Date(copy.returnDate).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell align="right">{copy.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
