const fs = require("fs").promises; // Use promises for cleaner async/await syntax
const path = require("path");

const bookFilePath = path.resolve(__dirname, "../client/public/book.json");

// Utility function: Read JSON file
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading or parsing file: ${error.message}`);
  }
};

// Utility function: Write JSON file
const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Error writing file: ${error.message}`);
  }
};

// Handler: Update book status
const updateStatus = async (req, res, next) => {
  const { bookId, status } = req.body;

  // Validate input
  if (!bookId || !status) {
    return res
      .status(400)
      .send("Invalid input: 'bookId' and 'status' are required.");
  }

  try {
    // Step 1: Read the existing books data
    const books = await readJSONFile(bookFilePath);

    // Step 2: Find the book to update
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex === -1) {
      return res.status(404).send("Book not found");
    }

    // Step 3: Update the book status
    books[bookIndex].status = status;

    // Step 4: Write the updated data back to the file
    await writeJSONFile(bookFilePath, books);

    res.send("Book status updated successfully");
  } catch (error) {
    console.error("Error:", error.message);
    next(error); // Pass the error to the error-handling middleware
  }
};

module.exports = updateStatus;
