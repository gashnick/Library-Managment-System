import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditBook() {
  const { id } = useParams(); // Get the book ID from the URL params
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    status: "available",
    country: "",
    language: "",
    link: "",
    pages: "",
    imageLink: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the book details based on the ID from the URL params
    axios
      .get(`http://localhost:3000/api/book/book-id/${id}`)
      .then((res) => {
        // Populate the form fields with the book data
        setFormData({
          title: res.data.book.title,
          author: res.data.book.author,
          year: res.data.book.year,
          status: res.data.book.status,
          country: res.data.book.country,
          language: res.data.book.language,
          link: res.data.book.link,
          pages: res.data.book.pages,
          imageLink: res.data.book.imageLink,
        });
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch book details.");
      });
  }, [id]); // Only refetch when the ID changes

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/book/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/dashboard/allbooks"); // Redirect after successful update
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Edit Book</h1>
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
          type="number"
          placeholder="Year"
          id="year"
          value={formData.year}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Country"
          id="country"
          value={formData.country}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Language"
          id="language"
          value={formData.language}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Link"
          id="link"
          value={formData.link}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Pages"
          id="pages"
          value={formData.pages}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Image Link"
          id="imageLink"
          value={formData.imageLink}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <select
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
}
