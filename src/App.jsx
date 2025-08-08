import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductTypesPage from "./pages/ProductTypesPage";


import ProductDetailPage from "./pages/ProductDetailPage";
import VarietiesPage from "./pages/VarietiesPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogin(userObj) {
    setUser(userObj);
    localStorage.setItem("loggedInUser", JSON.stringify(userObj));
  }

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {/* Granite Landscaping Products types */}
        <Route path="/products/:slug" element={<ProductTypesPage />} />

        {/* Patterns Varieties (and can generalize for any type if needed) */}
       
        {/* Product Detail Page for a specific variety */}
        <Route
          path="/products/:categoryId/:typeId/:varietyId"
          element={<ProductDetailPage />}
        />
        <Route path="/products/:categoryId/:typeId" element={<VarietiesPage />} />

      </Routes>
    </Router>
  );
}

export default App;
