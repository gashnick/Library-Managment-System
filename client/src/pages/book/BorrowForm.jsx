import React, { useState, useEffect } from "react";
import { fetchUsers, fetchCopies } from "./apiService"; // Assuming these functions are properly implemented

export default function BorrowForm() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);

  // Use your fetch functions to populate users and books
  useEffect(() => {
    const loadData = async () => {
      try {
        const usersResponse = await fetchUsers();
        const booksResponse = await fetchCopies();

        // Assuming fetchUsers and fetchCopies return data in the correct format
        if (usersResponse.success) {
          setUsers(usersResponse.users);
        } else {
          console.error("Failed to load users");
        }

        setBooks(booksResponse); // Assuming fetchCopies directly returns an array of books
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const handleBorrow = async (e) => {
    e.preventDefault();

    if (!selectedUser || selectedBooks.length === 0) {
      alert("Please select a user and at least one book to borrow.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/copy/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser,
          bookIds: selectedBooks,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Books borrowed successfully!");
        setSelectedUser("");
        setSelectedBooks([]);
      } else {
        alert("Failed to borrow books. Please try again.");
      }
    } catch (error) {
      console.error("Error borrowing books:", error);
      alert("An error occurred while borrowing books.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1em" }}>
      <h2>Borrow Books</h2>
      <form onSubmit={handleBorrow}>
        {/* Select User */}
        <label htmlFor="user" style={{ display: "block", margin: "0.5em 0" }}>
          Select User:
        </label>
        <select
          id="user"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ width: "100%", padding: "0.5em" }}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Select Books */}
        <label htmlFor="books" style={{ display: "block", margin: "0.5em 0" }}>
          Select Books (hold Ctrl to select multiple):
        </label>
        <select
          id="books"
          multiple
          value={selectedBooks}
          onChange={(e) =>
            setSelectedBooks(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          style={{
            width: "100%",
            padding: "0.5em",
            height: "150px",
            color: "black",
          }}
          required
        >
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            display: "block",
            width: "100%",
            padding: "0.5em",
            margin: "1em 0",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Borrow Books
        </button>
      </form>
    </div>
  );
}
