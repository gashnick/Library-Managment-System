import React from "react";
import Sidenav from "../components/Sidenav"; // Adjust the import path as necessary
import { Outlet, useLocation } from "react-router-dom";
import BookStats from "../components/BookStats";

export default function Dashboard() {
  const location = useLocation();
  const showDashContents = location.pathname === "/dashboard";

  return (
    <div className="flex">
      <Sidenav />
      <div className="flex-1 p-6 bg-slate-100">
        {showDashContents && (
          <>
            {/* Main Dashboard Header */}
            <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
            <p className="mt-4">Welcome to the Library Management System!</p>
            <p>
              Manage books, register borrowers, and track borrowing activity.
            </p>

            {/* Library Statistics Section */}
            <section className="">
              <BookStats />
            </section>

            {/* Additional Dashboard Content */}
            {/* You can add other sections or components here as needed */}
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
}
