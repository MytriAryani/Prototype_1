import { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductTypesPage from "./pages/ProductTypesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import VarietiesPage from "./pages/VarietiesPage";
import Cart from "./pages/Cart";
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

        <Route path="/products/:slug" element={<ProductTypesPage user={user} onLogout={handleLogout} />} />
        <Route path="/products/:categoryId/:typeId" element={<VarietiesPage user={user} onLogout={handleLogout} />} />
        <Route path="/products/:categoryId/:typeId/:varietyId" element={<ProductDetailPage user={user} onLogout={handleLogout} />} />

        <Route path="/checkout" element={<CheckoutPage user={user} onLogout={handleLogout} />} />
        <Route path="/cart" element={<Cart user={user} onLogout={handleLogout} />} />
        <Route path="/invoice" element={<Invoice user={user} onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
