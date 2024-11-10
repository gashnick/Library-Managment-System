// apiService.js

export const fetchBooks = async () => {
  try {
    const response = await fetch("/book.json");
    const data = await response.json();
    return data.response.books.map((book, index) => ({
      id: book.id || index,
      title: book.title || "N/A",
      author: book.author || "Unknown",
      genre: book.categories || "General",
      year: book.year || "N/A",
      status: book.status,
    }));
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
