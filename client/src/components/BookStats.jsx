import React, { useEffect, useState } from "react";

export default function BookStats() {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/book.json");
        const data = await response.json();
        // console.log("Fetched data: ", data); // Verify the structure
        if (data?.response?.books) {
          const booksData = data.response.books;
          setBooks(booksData);
          calculateStats(booksData);
        } else {
          console.error("Books data is missing from response.");
        }
      } catch (error) {
        console.log("Error loading books", error);
      }
    };

    fetchBooks(); // Call the async function
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p4">
      <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Library Status
        </h3>
        <div className="flex justify-between w-full mt-4 gap-4">
          <div className="text-center">
            <p>
              Total Books:
              <br /> {totalBooks}
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
      </div>
    </div>
  );
}
