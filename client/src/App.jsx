import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import ManageBooks from "./pages/ManageBooks";
import BorrowedBooks from "./pages/BorrowedBooks";
import ReturneBooks from "./pages/ReturneBooks";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/manage-books" element={<ManageBooks />} />
        <Route path="/borrowed-books" element={<BorrowedBooks />} />
        <Route path="/return-books" element={<ReturneBooks />} />
      </Routes>
    </BrowserRouter>
  );
}
