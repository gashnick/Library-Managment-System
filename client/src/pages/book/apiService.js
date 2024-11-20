// apiService.js

export const fetchBooks = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/book/books");
    if (!response.ok) {
      console.error("Failed to fetch books:", response.statusText);
      return [];
    }
    const data = await response.json();
    console.log("Fetched Books Data: ", data); // Log the full response
    return data.books || []; // Assuming books are in the 'books' key
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const fetchBorrowers = async () => {
  try {
    const response = await fetch("/api/borrower/borrowers");
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
