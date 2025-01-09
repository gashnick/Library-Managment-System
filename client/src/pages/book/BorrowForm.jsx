import React, { useState, useEffect } from "react";
import { fetchUsers, fetchBooks } from "./apiService";

export default function BorrowForm() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]); // Array for selected books
  const [userDetails, setUserDetails] = useState(null);
  const [dueDate, setDueDate] = useState(""); // State for the due date

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersResponse = await fetchUsers();
        const booksResponse = await fetchBooks();

        if (usersResponse.success) setUsers(usersResponse.users);
        if (booksResponse.success) setBooks(booksResponse.books);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    const user = users.find((u) => u._id === userId);
    setUserDetails(user);
  };

  const handleBookChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const bookIds = options.map((option) => option.value);
    setSelectedBooks(bookIds);
  };

  const handleBorrow = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/transaction/issue",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedUser,
            bookIds: selectedBooks, // Send array of book IDs
            dueDate, // Include the due date
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("Books successfully borrowed!");
        setSelectedUser("");
        setSelectedBooks([]);
        setUserDetails(null);
        setDueDate(""); // Reset the due date field
      } else {
        alert(data.message || "Failed to borrow books.");
      }
    } catch (error) {
      console.error("Borrow Error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mt-10 p-6">
      {/* User Selection Form */}
      <div className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Select User</h2>
        <label htmlFor="user" className="block font-medium">
          User
        </label>
        <select
          id="user"
          value={selectedUser}
          onChange={handleUserChange}
          className="mt-2 w-full rounded-lg border-gray-300 shadow p-2"
        >
          <option value="">Choose User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
        {userDetails && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <p>
              <strong>Name:</strong> {userDetails.username}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
          </div>
        )}
      </div>

      {/* Books Selection Form */}
<div className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow">
  <h2 className="text-xl font-bold mb-4">Select Books</h2>
  <label className="block font-medium mb-2">Books</label>
  <div className="space-y-2">
    {books.map((book) => (
      <div key={book._id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`book-${book._id}`}
          value={book._id}
          checked={selectedBooks.includes(book._id)}
          onChange={(e) => {
            const { value, checked } = e.target;
            setSelectedBooks((prev) =>
              checked
                ? [...prev, value] // Add book if checked
                : prev.filter((id) => id !== value) // Remove book if unchecked
            );
          }}
          className="w-4 h-4"
        />
        <label htmlFor={`book-${book._id}`} className="text-sm">
          {book.title} (Available: {book.quantity})
        </label>
      </div>
    ))}
  </div>
</div>

      {/* Borrow Confirmation Form */}
      <div className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Borrow Books</h2>
        <div className="mb-4">
          <label className="block font-medium">Selected User</label>
          <input
            type="text"
            value={userDetails?.username || ""}
            readOnly
            className="mt-2 w-full rounded-lg border-gray-300 shadow p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-2 w-full rounded-lg border-gray-300 shadow p-2"
          />
        </div>
        <button
          onClick={handleBorrow}
          className="w-full bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600"
          disabled={!selectedUser || selectedBooks.length === 0 || !dueDate}
        >
          Confirm Borrow
        </button>
      </div>
    </div>
  );
}
