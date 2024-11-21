// apiService.js

import axios from "axios";
export const fetchBooks = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/book/books");
    console.log("API response:", response.data); // Log the response for debugging
    return response.data; // Assuming the API already returns the array of books
  } catch (err) {
    console.error("Error fetching books:", err);
    return []; // Return an empty array on error
  }
};

export const fetchBorrowers = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/borrower/borrowers"
    );
    const data = await response.json();
    if (data.success && Array.isArray(data.borrowers)) {
      return data.borrowers;
    } else {
      console.error("Borrowers data is not an array:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching borrowers:", error);
    return [];
  }
};
