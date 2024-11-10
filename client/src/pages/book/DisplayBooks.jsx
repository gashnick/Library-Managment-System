import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { fetchBooks, fetchBorrowers } from "./apiService";
import BorrowAbookModel from "../../components/BorrowAbookModel";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 300 },
  { field: "author", headerName: "Author", width: 150 },
  { field: "genre", headerName: "Genre", width: 130 },
  { field: "year", headerName: "Year", width: 100 },
  { field: "status", headerName: "Status", width: 100 },
];

export default function DisplayBooks() {
  const [rows, setRows] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      const books = await fetchBooks();
      setRows(books);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    const loadBorrowers = async () => {
      const fetchedBorrowers = await fetchBorrowers();
      setBorrowers(fetchedBorrowers);
    };
    loadBorrowers();
  }, []);

  const handleBorrow = (borrowedBook, selectedBorrower) => {
    const updatedBooks = rows.map((book) =>
      book.id === borrowedBook.id ? { ...book, status: "Borrowed" } : book
    );
    setRows(updatedBooks);
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
        <button
          onClick={() => setOpenModal(true)}
          className="rounded-lg p-2 mb-2 text-white bg-green-700"
        >
          Borrow A Book
        </button>
      </div>

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection={false}
          sx={{ border: 0 }}
        />
      </Paper>

      <BorrowAbookModel
        open={openModal}
        onClose={() => setOpenModal(false)}
        books={rows}
        borrowers={borrowers}
        onBorrow={handleBorrow}
      />
    </div>
  );
}
