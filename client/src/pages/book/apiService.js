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
    return response.data;
  } catch (error) {
    console.log("Error fetching copies of book: ", error);
    return [];
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
