import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBorrowers } from "../pages/book/apiService";
import axios from "axios";

export default function BorrowForm() {
  const [books, setBooks] = useState([]); // List of all books
  const [selectedBooks, setSelectedBooks] = useState([]); // IDs of selected books
  const [borrowers, setBorrowers] = useState([]); // List of borrowers
  const [selectedBorrower, setSelectedBorrower] = useState(""); // Selected borrower ID
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingBooks, setFetchingBooks] = useState(true); // For loading state
  const [fetchingBorrowers, setFetchingBorrowers] = useState(true); // For loading state of borrowers
  const navigate = useNavigate();

  // Fetch books and borrowers on component mount
  useEffect(() => {
    // Fetch all books
    axios
      .get(`http://localhost:3000/api/book/books`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          // Filter out books that are already borrowed
          const availableBooks = res.data.filter(
            (book) => book.status !== "Borrowed"
          );
          setBooks(availableBooks); // Only set books that are available
        } else if (res.data.books && Array.isArray(res.data.books)) {
          const availableBooks = res.data.books.filter(
            (book) => book.status !== "Borrowed"
          );
          setBooks(availableBooks); // Only set books that are available
        } else {
          console.error("Unexpected response format:", res.data);
          setBooks([]); // Fallback to an empty array
        }
        setFetchingBooks(false); // Stop the loading state
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setError("Failed to fetch books.");
        setFetchingBooks(false);
      });

    // Fetch all borrowers
    fetchBorrowers()
      .then((data) => {
        setBorrowers(data);
        setFetchingBorrowers(false); // Stop loading state once borrowers are fetched
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch borrowers.");
        setFetchingBorrowers(false);
      });
  }, []);

  // Handle book selection
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

  // Handle form submission
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
      const borrowDate = new Date().toISOString(); // Get the current date in ISO format
      const res = await axios.post(`http://localhost:3000/api/borrowedbooks/addborrowed`, {
        books: selectedBooks, // Array of selected books
        borrowerId: selectedBorrower, // ID of the selected borrower
        borrowDate: borrowDate, // Send the borrow date
      });
      if (!res.data.success) {
        setLoading(false);
        setError(res.data.message);
        return;
      }
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
          {fetchingBorrowers ? (
            <p>Loading borrowers...</p>
          ) : borrowers.length > 0 ? (
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
          ) : (
            <p>No borrowers available.</p>
          )}
        </div>

        {/* Book Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Books</h2>
          {fetchingBooks ? (
            <p>Loading books...</p>
          ) : books.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {books.map((book) => (
                <label key={book._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={book._id}
                    onChange={handleBookSelection}
                  />
                  <span>
                    {book.title} by {book.author} ({book.year}) -{" "}
                    <strong>{book.status}</strong>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p>No books available.</p>
          )}
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
