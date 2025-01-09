import React, { useState } from "react";

const ReturnPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [borrowedBooks, setBorrowedBooks] = useState([]); // List of borrowed books
  const [selectedBook, setSelectedBook] = useState(null); // Selected book for return
  const [error, setError] = useState(""); // Error state

  // Function to search for borrowed books by title
  const findBook = async () => {
    setError(""); // Reset error state
    try {
      const response = await fetch(
        `http://localhost:3000/api/transaction/find?bookTitle=${searchQuery}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const borrowedBooks = data.filter((book) => book.status === "Borrowed");
        setBorrowedBooks(borrowedBooks);
      } else {
        setBorrowedBooks([]);
        setError("No borrowed books found matching the search criteria.");
      }
    } catch (err) {
      setError("Error fetching books. Please try again.");
    }
  };

  // Function to handle book selection
  const handleSelectBook = (bookId) => {
    const book = borrowedBooks.find((b) => b._id === bookId);
    setSelectedBook(book);
  };

  // Function to return the selected book
  const returnBook = async () => {
    if (!selectedBook) {
      alert("Please select a book to return.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:3000/api/transaction/return/${selectedBook._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ borrowerId: selectedBook.borrowerId }), // Use borrowerId here
        }
      );
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message || "Book returned successfully!");
        setBorrowedBooks(borrowedBooks.filter((book) => book._id !== selectedBook._id));
        setSelectedBook(null);
      } else {
        alert(data.message || "Failed to return book.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Return Books</h2>

      <div className="flex gap-6">
        {/* Search Box */}
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-4">Search Book</h3>
            <input
              type="text"
              placeholder="Enter Book Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <button
              onClick={findBook}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Find Book
            </button>
          </div>
        </div>

        {/* Borrowed Books List Box */}
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-4">Borrowed Books</h3>
          {error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded">
              {error}
            </div>
          ) : (
            <ul>
              {borrowedBooks.map((book) => (
                <li
                  key={book._id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectBook(book._id)}
                >
                  <span>{book.title}</span> - <span>Borrower: {book.borrower}</span>
                  {selectedBook && selectedBook._id === book._id && (
                    <span className="text-green-500 ml-2">(Selected)</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Return Book Button */}
      <div className="mt-6 text-center">
        <button
          onClick={returnBook}
          disabled={!selectedBook}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Return Selected Book
        </button>
      </div>
    </div>
  );
};

export default ReturnPage;
