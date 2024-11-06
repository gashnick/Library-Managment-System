import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BorrowerBookForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    booksBorrowed: 0,
    returnDueDate: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Track form data
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:3000/api/borrower/saveborrower",
        {
          // Changed to /api/borrower
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      // Handle successful addition
      setLoading(false);
      setError(null);
      navigate("/dashboard/allborrowers"); // Redirect to the list of borrowers
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Add Borrower</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          id="name"
          value={formData.name}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Contact"
          id="contact"
          value={formData.contact}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Books Borrowed"
          id="booksBorrowed"
          value={formData.booksBorrowed}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="date"
          placeholder="Return Due Date"
          id="returnDueDate"
          value={formData.returnDueDate}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Add Borrower"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
