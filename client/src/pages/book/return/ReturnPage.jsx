import React, { useState } from "react";
import axios from "axios";

const ReturnPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookDetails, setBookDetails] = useState(null);
  const [error, setError] = useState("");

  // Fetch book details based on search query
  const findBook = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/transaction/find?title=${searchQuery}`
      );
      if (data.length === 0) {
        setError("No books found matching the search criteria.");
      } else {
        setBookDetails(data[0]); // Assuming only one book matches, taking the first result
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      setBookDetails(null);
      setError("Error fetching book. Please try again later.");
    }
  };

  // Return book functionality
  const returnBook = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/transaction/return/${bookDetails._id}` // Use bookDetails._id here
      );
      alert(data.message || "Book returned successfully!");
      setBookDetails(null); // Clear book details after returning
      setSearchQuery(""); // Clear the search field
    } catch (error) {
      alert("Failed to return book. Please try again.");
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Return a Book</h2>

      {/* Search Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Book Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={findBook}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
        >
          Find
        </button>
      </div>

      {/* Display Book Details or Error */}
      {error && <p className="text-red-500">{error}</p>}
      {bookDetails && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Book Details</h3>
          <p>
            <strong>Title:</strong> {bookDetails.title}
          </p>
          <p>
            <strong>Author:</strong> {bookDetails.author}
          </p>
          <p>
            <strong>Status:</strong> {bookDetails.status}
          </p>
          <button
            onClick={returnBook}
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
          >
            Return Book
          </button>
        </div>
      )}
    </div>
  );
};

export default ReturnPage;
