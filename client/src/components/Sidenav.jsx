import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";

const Sidenav = () => {
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate()

  const handleSignOut = async () => {
      try {
        dispatch(signOutStart());
        const res = await fetch("/api/auth/signout");
        const data = await res.json();
        if (data.success === false) {
          dispatch(signOutFailure(data.message));
          return;
        }
        dispatch(signOutSuccess(data));
        navigate("/sign-in");
      } catch (error) {
        dispatch(signOutFailure(error.message));
      }
    };
  
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
        <span onClick={handleSignOut} className="block p-4 hover:bg-slate-700 cursor-pointer">
          Signout
        </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidenav;
