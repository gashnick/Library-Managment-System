import React, { useEffect, useState } from "react";
import { fetchBooks } from "../pages/book/apiService"; // Import fetchBooks

export default function BookStats() {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchBooks(); // Use fetchBooks function
        setBooks(booksData);
        calculateStats(booksData);
      } catch (error) {
        console.log("Error loading books", error);
        setError(error.message); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    loadBooks(); // Call the async function

    return () => {
      setLoading(false); // Cleanup function to stop loading on unmount
    };
  }, []);

  const calculateStats = (booksData) => {
    const total = booksData.length;
    const borrowed = booksData.filter(
      (book) => book.status === "Borrowed"
    ).length;
    const available = total - borrowed;

    setTotalBooks(total);
    setBorrowedBooks(borrowed);
    setAvailableBooks(available);
  };

  return (
    <div className="bg-gray-100 ">
      <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Library Status
        </h3>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="flex justify-between w-full mt-4 gap-4">
            <div className="text-center">
              <p>
                Total Books: <br /> {totalBooks}
              </p>
            </div>
            <div className="text-center">
              <p>
                Borrowed Books: <br /> {borrowedBooks}
              </p>
            </div>
            <div className="text-center">
              <p>
                Available Books: <br /> {availableBooks}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
