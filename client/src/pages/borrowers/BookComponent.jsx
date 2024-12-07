import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBorrowers } from "../book/apiService";
import axios from "axios";

export default function BorrowForm() {
  const [books, setBooks] = useState([]); // List of all books
  const [selectedBooks, setSelectedBooks] = useState([]); // IDs of selected books
  const [borrowers, setBorrowers] = useState([]); // List of borrowers
  const [selectedBorrower, setSelectedBorrower] = useState(""); // Selected borrower ID
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all books
    axios
      .get(`http://localhost:3000/api/book/books`)
      .then((res) => {
        setBooks(res.data.books);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch books.");
      });

    // Fetch all borrowers
    fetchBorrowers()
      .then((data) => {
        setBorrowers(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch borrowers.");
      });
  }, []);

  const handleBookSelection = (e) => {
    const bookId = e.target.value;
    const isChecked = e.target.checked;
    setSelectedBooks(
      (prevSelected) =>
        isChecked
          ? [...prevSelected, bookId] // Add the book ID
          : prevSelected.filter((id) => id !== bookId) // Remove the book ID
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedBooks.length === 0) {
      setError("Please select at least one book.");
      return;
    }
    if (!selectedBorrower) {
      setError("Please select a borrower.");
      return;
    }

    setLoading(true);

    try {
      // Send selected books and borrower to the server
      const res = await axios.post(`/api/borrowedbooks/addborrowed`, {
        bookIds: selectedBooks,
        borrowerId: selectedBorrower,
      });
      if (!res.data.success) {
        setLoading(false);
        setError(res.data.message);
        return;
      }

      // Update the status of selected books to "Borrowed"
      const updatedBooks = books.map((book) =>
        selectedBooks.includes(book._id)
          ? { ...book, status: "Borrowed" }
          : book
      );
      setBooks(updatedBooks); // Update state with new statuses

      setLoading(false);
      setError(null);
      navigate("/dashboard/borrowedbooks"); // Redirect to the borrowed books page
    } catch (err) {
      setLoading(false);
      setError("Failed to borrow books.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Borrow Books</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Borrower Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Borrower</h2>
          <select
            value={selectedBorrower}
            onChange={(e) => setSelectedBorrower(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">-- Select a Borrower --</option>
            {borrowers.map((borrower) => (
              <option key={borrower._id} value={borrower._id}>
                {borrower.name}
              </option>
            ))}
          </select>
        </div>

        {/* Book Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Books</h2>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {books.map((book) => (
              <label key={book._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={book._id}
                  onChange={handleBookSelection}
                  disabled={book.status === "Borrowed"} // Disable already borrowed books
                />
                <span>
                  {book.title} by {book.author} ({book.year}) -{" "}
                  {book.status === "Borrowed" ? "Borrowed" : "Available"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Processing..." : "Borrow Selected Books"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
}
