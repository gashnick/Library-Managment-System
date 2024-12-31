// apiService.js

import axios from "axios";
export const fetchBooks = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/book/books");
    return {
      success: true,
      books: response.data, // Ensure the response contains this structure
    };
  } catch (err) {
    console.error("Error fetching books:", err);
    return {
      success: false,
      books: [],
    };
  }
};

export const fetchCopies = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/copy/copies");
    return response.data;
  } catch (error) {
    console.log("Error fetching copies of book: ", error);
    return [];
  }
};
export const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/user/allusers");
    return response.data;
  } catch (error) {
    console.log(error);
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
