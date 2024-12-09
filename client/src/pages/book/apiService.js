// apiService.js

import axios from "axios";
export const fetchBooks = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/book/books");
    return response.data; // Assuming the API already returns the array of books
  } catch (err) {
    console.error("Error fetching books:", err);
    return []; // Return an empty array on error
  }
};

export const fetchBooksCopies = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/book/copies");
    return response.data
  } catch (error) {
      console.log("Error fetching copies of book: ", error);
      return []
  }
  
}
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

// apiService.js (or wherever you manage API calls)
export const updateBookStatus = async (book) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/book/status/${book._id}`,
      {
        status: "Borrowed", // Set the new status
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating book status:", err);
    throw new Error("Failed to update book status.");
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/book/delete/${id}`
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Failed to delete book (status: ${response.status})`);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error; // Re-throw the error for further handling in the calling function
  }
};
