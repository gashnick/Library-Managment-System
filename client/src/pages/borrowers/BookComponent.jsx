import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { fetchBorrowers } from "../book/apiService";

const BookComponent = ({ book, onBorrow }) => {
  const [open, setOpen] = useState(false);
  const [borrowerId, setBorrowerId] = useState(""); // Store borrower ID, not name
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track any error

  // Fetch the list of borrowers from the API
  useEffect(() => {
    const getBorrowers = async () => {
      try {
        const fetchedBorrowers = await fetchBorrowers();
        setBorrowers(fetchedBorrowers); // Update state with fetched borrowers
      } catch (error) {
        setError("Failed to fetch borrowers. Please try again later.");
        console.error(error);
      }
    };

    getBorrowers();
  }, []);

  // Open the modal
  const handleOpen = () => setOpen(true);

  // Close the modal
  const handleClose = () => setOpen(false);

  // Handle borrower selection and confirmation
  const handleBorrow = async () => {
    if (!borrowerId) {
      alert("Please select a borrower");
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Reset error

    try {
      // Find the selected borrower by their ID
      const selectedBorrower = borrowers.find(
        (borrower) => borrower._id === borrowerId
      );

      // If borrower is found, prepare the borrowed book data
      if (selectedBorrower) {
        const borrowedBookData = {
          title: book.title,
          author: book.author,
          genre: book.genre,
          year: book.year,
          status: "Borrowed",
          borrowerId, // Store the borrowerId
          borrowerName: selectedBorrower.name, // Include the borrower's name
          borrowDate: new Date(),
        };

        // Insert the borrowed book into the database
        await axios.post(
          "http://localhost:3000/api/borrowedbooks/addborrowed",
          borrowedBookData
        );
        //console.log("Server Response:", response);
        // Update the UI
        onBorrow(borrowedBookData); // Call the parent component to refresh the list
        setOpen(false); // Close the modal
      } else {
        setError("Selected borrower not found. Please try again.");
      }
    } catch (error) {
      setError("Failed to borrow the book. Please try again later.");
      console.error("Error borrowing book:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={handleOpen}
        disabled={book.status === "Borrowed"}
      >
        Borrow
      </Button>

      {/* Modal for borrower selection */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select a Borrower</DialogTitle>
        <DialogContent>
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          {/* Error message */}
          <TextField
            select
            label="Select Borrower"
            fullWidth
            value={borrowerId} // Use borrowerId instead of name
            onChange={(e) => setBorrowerId(e.target.value)} // Update borrowerId
            SelectProps={{
              native: true,
            }}
            disabled={loading} // Disable if loading
          >
            <option value="">-- Select Borrower --</option>
            {borrowers.length > 0 ? (
              borrowers.map((borrower) => (
                <option key={borrower._id} value={borrower._id}>
                  {borrower.name}
                </option>
              ))
            ) : (
              <option disabled>No borrowers available</option>
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleBorrow} color="primary" disabled={loading}>
            {loading ? "Processing..." : "Confirm Borrow"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookComponent;
