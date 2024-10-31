import React from "react";

const Sidenav = () => {
  return (
    <div className="w-64 h-screen bg-slate-800 text-white">
      <h2 className="text-2xl font-bold p-4">Library Management</h2>
      <ul className="space-y-2">
        <li>
          <a href="/dashboard" className="block p-4 hover:bg-slate-700">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/manage-books" className="block p-4 hover:bg-slate-700">
            Manage Books
          </a>
        </li>
        <li>
          <a href="/register-borrower" className="block p-4 hover:bg-slate-700">
            Register Borrower
          </a>
        </li>
        <li>
          <a href="/borrowed-books" className="block p-4 hover:bg-slate-700">
            Borrowed Books
          </a>
        </li>
        <li>
          <a href="/return-books" className="block p-4 hover:bg-slate-700">
            Return Books
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidenav;
