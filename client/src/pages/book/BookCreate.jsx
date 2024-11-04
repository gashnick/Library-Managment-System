import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BookCreate() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    status: "available",
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
      const res = await fetch("/api/book/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      //console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      // Handle successful book add
      setLoading(false);
      setError(null);
      setFormData({
        title: "",
        author: "",
        genre: "",
        year: "",
        status: "available",
      }); // Clear form
      navigate("/dashboard/allbooks");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Add book</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Book title"
          id="title"
          value={formData.title}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Book author"
          id="author"
          value={formData.author}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Book genre"
          id="genre"
          value={formData.genre}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="number" // Changed to number
          placeholder="Year published"
          id="year"
          value={formData.year}
          className="border p-3 rounded-lg"
          onChange={handleChange}
          min={1900} // Optional min value
          max={new Date().getFullYear()} // Optional max value
        />
        <select
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="available">available</option>
          <option value="borrowed">borrowed</option>
          {/* Add more options if needed */}
        </select>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Add book"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Not sure yet?</p>
        <Link to={"/dashboard/allbooks"}>
          <span className="text-blue-700">See all Books</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
