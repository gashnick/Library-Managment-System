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
import DateFilter from "../../../components/DateFilter";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Fetch transactions from the backend
  const fetchTransactions = async (startDate, endDate) => {
    try {
      let url = "http://localhost:3000/api/transaction/get";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const { data } = await axios.get(url);
      setTransactions(data);
      setFilteredTransactions(data);  // Initially, set the filtered transactions to the same as the fetched data
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  // Handle the date filter
  const handleDateFilter = ({ startDate, endDate }) => {
    // Filter the transactions based on the provided date range
    const filtered = transactions.filter((txn) => {
      const borrowDate = new Date(txn.borrowDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return borrowDate >= start && borrowDate <= end;
    });
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Transaction History</h2>
      <DateFilter onFilter={handleDateFilter} className="mb-4" />
      <TableContainer component={Paper} className="mt-5">
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
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
