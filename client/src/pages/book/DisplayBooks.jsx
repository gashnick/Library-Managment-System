import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Link } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "author", headerName: "Author", width: 150 },
  { field: "genre", headerName: "Genre", width: 130 },
  { field: "year", headerName: "Year", width: 100 },
  { field: "status", headerName: "Status", width: 100 },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => (
      <div className="gap-2">
        <button
          variant="contained"
          color="primary"
          size="small"
          className="text-white text-sm rounded-sm mr-2 bg-green-700 p-1"
        >
          Edit
        </button>
        <button
          variant="contained"
          color="primary"
          size="small"
          className="rounded-sm text-sm  text-white bg-red-700 p-1"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </button>
      </div>
    ),
  },
];

export default function DisplayBooks() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/book/books"
        );
        const books = response.data;
        const formattedBooks = books.map((book, index) => ({
          id: index + 1,
          title: book.title,
          author: book.author,
          genre: book.genre,
          year: book.year,
          status: book.status,
        }));

        setRows(formattedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/book/delete/$(id)`);
      setRows(
        rows.filter((row) => {
          row.id !== id;
        })
      );
    } catch (error) {
      console.log("Error deleting the book", error);
    }
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
    </div>
  );
}
