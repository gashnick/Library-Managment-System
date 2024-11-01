import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok) {
          setBooks(data);
        } else {
          setError(data.message || "Failed to fetch books");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Manage Books</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && books.length === 0 && <p>No books available.</p>}
      {!loading && !error && books.length > 0 && (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Author</th>
              <th className="border border-gray-300 p-2">Genre</th>
              <th className="border border-gray-300 p-2">Year Published</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td className="border border-gray-300 p-2">{book.title}</td>
                <td className="border border-gray-300 p-2">{book.author}</td>
                <td className="border border-gray-300 p-2">{book.genre}</td>
                <td className="border border-gray-300 p-2">{book.year}</td>
                <td className="border border-gray-300 p-2">{book.status}</td>
                <td className="border border-gray-300 p-2">
                  <Link
                    to={`/books/edit/${book._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  {/* Add a delete button if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
