import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/transaction/get"
      );
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Transaction History
      </h2>

      <TableContainer component={Paper}>
        <Table aria-label="transaction table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Book Title</strong>
              </TableCell>
              <TableCell>
                <strong>Author</strong>
              </TableCell>
              <TableCell>
                <strong>Username</strong>
              </TableCell>
              <TableCell>
                <strong>Borrow Date</strong>
              </TableCell>
              <TableCell>
                <strong>Return Date</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((txn) => (
                <TableRow key={txn._id}>
                  <TableCell>{txn.bookId?.title || "N/A"}</TableCell>
                  <TableCell>{txn.bookId?.author || "N/A"}</TableCell>
                  <TableCell>{txn.userId?.username || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(txn.borrowDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {txn.returnDate
                      ? new Date(txn.returnDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{txn.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Transactions Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Transaction;
