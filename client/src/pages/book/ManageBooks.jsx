import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookStart,
  fetchBookSuccess,
  fetchBookFailure,
  deleteBook,
} from "../../redux/books/bookSlice";
import { Link } from "react-router-dom";

export default function ManageBooks() {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.book);
  useEffect(() => {
    const fetchBooks = async () => {
      dispatch(fetchBookStart());
      try {
        const res = await "/api/books";
        const data = await res.json();
        dispatch(fetchBookSuccess(data));
      } catch (error) {
        dispatch(fetchBookFailure(error));
      }
    };
    fetchBooks();
  }, [dispatch]);
  const handleDelete = (id) => {
    dispatch(deleteBook(id));
    fetch("/api/books/${id}", { method: "DELETE" });
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Book List</h1>
      {loading && <p>loading...</p>}
      {error && <p className="text-blue-500">{error}</p>}
      <Link to="/books/add" className="text-blue-500 underline">
        Add New Book
      </Link>
      <ul>
        {books.map((book) => (
          <li key={book.id} className="flex justify-between my-2">
            <span>{book.title}</span>
            <div>
              <Link
                to={`/books/edit/${book.id}`}
                className="text-blue-500 mx-2"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(book.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
