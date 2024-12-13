import React, { useState } from "react";

function ReturnPage() {
  const [bookId, setBookId] = useState("");

  const handleReturn = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/copy/return/${bookId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("Book returned successfully!");
        setBookId(""); // Clear the input field
      } else {
        alert("Error returning book. Please try again.");
      }
    } catch (error) {
      console.error("Error returning book:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleReturn}>
      <label htmlFor="bookId">Book ID:</label>
      <input
        type="text"
        id="bookId"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        required
      />
      <button type="submit">Return Book</button>
    </form>
  );
}

export default ReturnPage;
