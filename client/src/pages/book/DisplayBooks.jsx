import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Link } from "react-router-dom";

const columns = (handleDelete) => [
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
          className="rounded-sm text-sm text-white bg-red-700 p-1"
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
  const [search, setSearch] = useState("Harry Potter"); // Example search term

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${search}&key=AIzaSyDFhoAT_M0w74UcPGVcA6RwKpXrRuanauo`
        );

        // Format the data
        const books = response.data.items.map((item, index) => ({
          id: item.id || index, // Use API ID if available, or index
          title: item.volumeInfo.title || "N/A",
          author: item.volumeInfo.authors?.join(", ") || "Unknown",
          genre: item.volumeInfo.categories?.[0] || "General",
          year: item.volumeInfo.publishedDate?.split("-")[0] || "N/A",
          status: "Available", // Set your own default status or logic
        }));

        setRows(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [search]);

  const handleDelete = async (id) => {
    try {
      // Update the delete URL if needed
      await axios.delete(`http://localhost:3000/api/book/delete/${id}`);
      setRows(rows.filter((row) => row.id !== id));
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
          columns={columns(handleDelete)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection={false}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
