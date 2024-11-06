const Borrower = require("../models/borrower.model");

const borrowerSave = async (req, res, next) => {
  const { name, contact, email, booksBorrowed, returnDueDate } = req.body;

  // Validate email uniqueness
  try {
    const existingBorrower = await Borrower.findOne({ email });
    if (existingBorrower) {
      return res.status(400).json({
        success: false,
        message: "Borrower already exists with this email.",
      });
    }

    // Create new borrower
    const newBorrower = new Borrower({
      name,
      contact,
      email,
      booksBorrowed: typeof booksBorrowed === "number" ? booksBorrowed : 0, // Ensure it's a valid number
      returnDueDate: returnDueDate || null, // Handle missing returnDueDate gracefully
    });

    // Save borrower to the database
    await newBorrower.save();
    res
      .status(200)
      .json({ success: true, message: "Borrower created successfully!" });
  } catch (error) {
    // Handle any errors in the process
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "There was an error creating the borrower.",
    });
  }
};

const getBorrowers = async (req, res, next) => {
  try {
    const borrowers = await Borrower.find();
    res.status(200).json({ success: true, borrowers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  borrowerSave,
  getBorrowers,
};
