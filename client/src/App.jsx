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
import EditBook from "./pages/book/EditBook";
import BorrowForm from "./pages/book/BorrowForm";
import Page from "./pages/book/copies/Page";
import ReturnPagePage from "./pages/book/return/ReturnPage";
import Transaction from "./pages/book/transaction/Transaction";
import Users from "./pages/users/Users";

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
          <Route path="edit-book/:id" element={<EditBook />} />
          <Route path="borrow" element={<BorrowForm />} />
          <Route path="copy" element={<Page />} />
          <Route path="return" element={<ReturnPagePage />} />
          <Route path="transactions" element={<Transaction />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
