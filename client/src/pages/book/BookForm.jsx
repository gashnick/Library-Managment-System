import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, updateBook } from "../../redux/book/bookSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function BookForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    status: "Available",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);

  useEffect(() => {
    if (id) {
      const bookToEdit = books.find((book) => book.id === id);
      if (bookToEdit) setFormData(bookToEdit);
    }
  }, [id, books]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      dispatch(updateBook({ ...formData, id }));
    } else {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newBook = await res.json();
      dispatch(addBook(newBook));
    }
    navigate("/books");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Book" : "Add Book"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          name="year"
          placeholder="Year of Publication"
          value={formData.year}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="Available">Available</option>
          <option value="Borrowed">Borrowed</option>
        </select>
        <button className="bg-blue-500 text-white p-3 rounded-lg">
          {id ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
}
