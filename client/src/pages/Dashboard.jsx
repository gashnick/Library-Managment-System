import React from "react";
import Sidenav from "../components/Sidenav"; // Adjust the import path as necessary

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidenav />
      <div className="flex-1 p-6 bg-slate-100">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4">Welcome to the Library Management System!</p>
        <p>Manage books, register borrowers, and track borrowing activity.</p>
        {/* Additional components or information can be added here */}
      </div>
    </div>
  );
}
