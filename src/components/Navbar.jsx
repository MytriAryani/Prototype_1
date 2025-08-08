import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handles scroll to "products-section" on home page
  function handleProductsClick(e) {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home, do a smooth-scroll
      const section = document.getElementById("products-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home, then scroll after navigation
      navigate("/", { replace: false });
      setTimeout(() => {
        const section = document.getElementById("products-section");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white flex-1 relative">
      <div className="font-bold text-lg text-center">RR STONES</div>
      <ul className="flex items-center justify-center gap-6 flex-6 text-gray-700">
        <li>
          <Link to="/" className="hover:text-black">
            HOME
          </Link>
        </li>
        <li>
          <a
            href="#products-section"
            className="hover:text-black cursor-pointer"
            onClick={handleProductsClick}
          >
            PRODUCTS
          </a>
        </li>
        <li>
          <Link to="/about-us" className="hover:text-black">
            ABOUT US
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-black">
            CONTACT
          </Link>
        </li>
      </ul>

      <div className="flex-5 text-center">
        <SearchBar />
      </div>

      <div className="flex flex-2 items-center justify-center gap-4">
        {/* Cart Icon */}
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l1.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61l1.23-7.39H6" />
        </svg>
        {!user ? (
          <Link
            to="/login"
            className="px-4 py-1 text-black bg-white border border-black rounded hover:bg-black hover:text-white transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={onLogout}
            className="px-4 py-1 text-black bg-white border border-black rounded hover:bg-black hover:text-white transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
