import React from "react";

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="bg-black text-white rounded-full px-6 py-2 font-semibold shadow hover:bg-gray-800 transition"
  >
    {children}
  </button>
);

export default Button;
