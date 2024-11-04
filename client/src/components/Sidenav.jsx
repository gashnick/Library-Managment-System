import React from "react";
import { Link } from "react-router-dom";

const Sidenav = () => {
  return (
    <div className="w-64 h-screen bg-slate-800 text-white">
      <h2 className="text-2xl font-bold p-4">Library Management</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/dashboard" className="block p-4 hover:bg-slate-700">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="manage-books" className="block p-4 hover:bg-slate-700">
            Manage Books
          </Link>
        </li>
        <li>
          <Link to="register-borrower" className="block p-4 hover:bg-slate-700">
            Register Borrower
          </Link>
        </li>
        <li>
          <Link to="borrowed-books" className="block p-4 hover:bg-slate-700">
            Borrowed Books
          </Link>
        </li>
        <li>
          <Link to="return-books" className="block p-4 hover:bg-slate-700">
            Return Books
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidenav;
