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
          <Link
            to="/dashboard/allbooks"
            className="block p-4 hover:bg-slate-700"
          >
            Books
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/users"
            className="block p-4 hover:bg-slate-700"
          >
            Users
          </Link>
        </li>
        <li>
          <Link to="/dashboard/borrow" className="block p-4 hover:bg-slate-700">
            Issue Book
          </Link>
        </li>
        <li>
          <Link to="/dashboard/return" className="block p-4 hover:bg-slate-700">
            Return Book
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/transactions"
            className="block p-4 hover:bg-slate-700"
          >
            Transaction History
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/history"
            className="block p-4 hover:bg-slate-700"
          >
            Sign out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidenav;
