import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header>
      <div className="flex justify-between items-center  max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            Library Managment System
          </h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hover:underline hover:cursor-pointer ">Home</li>
          </Link>
          <Link to="/about">
            <li className="hover:underline hover:cursor-pointer">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="hover:underline hover: cursor-pointer">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
