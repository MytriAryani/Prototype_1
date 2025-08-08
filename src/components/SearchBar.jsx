import React from "react";

const SearchBar = () => (
  <div className="w-full max-w-md mx-auto">
    <div className="flex items-center bg-[#F6F6F6] rounded-full px-4 py-2 shadow-none border border-transparent">
      <svg
        className="w-5 h-5 text-gray-400 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search for products..."
        className="bg-transparent flex-1 border-none outline-none placeholder-gray-400 text-gray-800 text-sm"
      />
    </div>
  </div>
);

export default SearchBar;
