// Ankit Katwal
import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onOpenCreateModal, taskStats = { total: 0, pending: 0, completed: 0 } }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-8 py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-xs">
            ✓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                To-Do Application
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                CSE 230
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              Model Institute of Technology
            </p>
          </div>
        </div>

        {/* User Actions */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
              <span className="text-amber-600 font-semibold">{taskStats.pending} Pending</span>
              <span className="text-gray-300">|</span>
              <span className="text-emerald-600 font-semibold">{taskStats.completed} Completed</span>
            </div>

            {/* Add Task Button */}
            <button
              onClick={onOpenCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-3.5 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="text-sm font-bold">+</span>
              <span>Add Task</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-gray-900 leading-tight">
                  {user.name}
                </div>
                <div className="text-[11px] text-gray-500 leading-tight truncate max-w-[130px]">
                  {user.email}
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="ml-1 px-2.5 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-600 hover:text-red-600 text-xs font-medium border border-gray-300 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-500">Not signed in</div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
