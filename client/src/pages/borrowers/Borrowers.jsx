import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/borrower/borrowers"
        );
        console.log(response.data); // Log to check the structure
        // Assuming the API response is an object with a 'borrowers' property
        if (Array.isArray(response.data)) {
          setBorrowers(response.data);
        } else if (response.data && Array.isArray(response.data.borrowers)) {
          setBorrowers(response.data.borrowers);
        } else {
          setBorrowers([]); // Fallback if the data is not in expected format
        }
      } catch (error) {
        console.error("Error fetching borrowers:", error);
      }
    };

    fetchBorrowers();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold mb-5">ALL BORROWERS</h1>
        <span>
          <Link to={"/dashboard/registerborrower"}>
            <button className="rounded-lg p-3 text-white bg-slate-700">
              Add A Borrower
            </button>
          </Link>
        </span>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="borrowers table">
          <TableHead>
            <TableRow>
              <TableCell>Borrower Name</TableCell>
              <TableCell align="right">Contact</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Books Borrowed</TableCell>
              <TableCell align="right">Return Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowers.length > 0 ? (
              borrowers.map((borrower) => (
                <TableRow key={borrower._id}>
                  <TableCell component="th" scope="row">
                    {borrower.name}
                  </TableCell>
                  <TableCell align="right">{borrower.contact}</TableCell>
                  <TableCell align="right">{borrower.email}</TableCell>
                  <TableCell align="right">{borrower.booksBorrowed}</TableCell>
                  <TableCell align="right">{borrower.returnDueDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No borrowers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
