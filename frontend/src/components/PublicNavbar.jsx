import React from "react";
import { Link, useLocation } from "react-router-dom";

const PublicNavbar = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-6 sm:px-12 flex items-center justify-between">
      <Link to="/login" className="text-blue-600 font-bold text-lg sm:text-xl tracking-tight no-underline hover:text-blue-700">
        TaskManager
      </Link>
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors no-underline ${
            isLogin
              ? "text-gray-700 bg-gray-100"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors no-underline ${
            !isLogin
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default PublicNavbar;
