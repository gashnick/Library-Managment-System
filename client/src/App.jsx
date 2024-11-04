import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import BorrowedBooks from "./pages/BorrowedBooks";
import ReturneBooks from "./pages/ReturneBooks";
import PrivateRoute from "./components/PrivateRoute";
import BookCreate from "./pages/book/BookCreate";
import ManageBooks from "./pages/book/ManageBooks";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="borrowed-books" element={<BorrowedBooks />} />
          <Route path="return-books" element={<ReturneBooks />} />
          <Route path="create" element={<BookCreate />} />
          <Route path="manage-books" element={<ManageBooks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
