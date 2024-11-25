import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import BookCreate from "./pages/book/BookCreate";
import DispalyBooks from "./pages/book/DisplayBooks";
import RegisterBorrower from "./pages/borrowers/RegisterBorrower";
import Borrowers from "./pages/borrowers/Borrowers";
import BorrowedBooks from "./pages/borrowers/BorrowedBooks";
import History from "./pages/borrowers/History";
import EditBook from "./pages/book/EditBook";
import ReturnedBook from "./pages/borrowers/ReturnedBook";

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
          <Route path="create" element={<BookCreate />} />
          <Route path="allbooks" element={<DispalyBooks />} />
          <Route path="allborrowers" element={<Borrowers />} />
          <Route path="registerborrower" element={<RegisterBorrower />} />
          <Route path="borrowed" element={<BorrowedBooks />} />
          <Route path="returned" element={<ReturnedBook />} />
          <Route path="history" element={<History />} />
          <Route path="edit-book/:id" element={<EditBook />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
