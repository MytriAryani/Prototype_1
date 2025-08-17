import { useNavigate, useLocation } from "react-router-dom";

export default function CartPopup({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLoginRedirect() {
  console.log("Redirecting to login…", location.pathname);
  onClose();
  navigate("/login", { state: { from: location } });
}


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
        <h2 className="text-lg font-semibold mb-3">Login Required</h2>
        <p className="text-gray-600 mb-4">Please log in to view your cart.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLoginRedirect}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
