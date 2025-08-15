import { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductTypesPage from "./pages/ProductTypesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import VarietiesPage from "./pages/VarietiesPage";
import Cart from "./pages/Cart"; // ✅ Import your Cart page
import CheckoutPage from "./pages/Checkout";
import Invoice from "./pages/Invoice";

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

        {/* Patterns Varieties */}
        <Route path="/products/:categoryId/:typeId" element={<VarietiesPage />} />

        {/* Product Detail Page */}
        <Route
          path="/products/:categoryId/:typeId/:varietyId"
          element={<ProductDetailPage />}
        />
        <Route path="/checkout" element={<CheckoutPage/>} />
        {/* ✅ Cart page route */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
