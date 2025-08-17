import { useState } from "react";
import customers from "../data/customers.json";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Correct way: get `pathname` if redirected from another page
  const from = location.state?.from?.pathname || "/";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const user = customers.find(
      (u) =>
        u.username === form.identifier ||
        u.email === form.identifier ||
        u.phone === form.identifier
    );

    if (user && user.password === form.password) {
      onLogin(user);
      console.log("✅ Login successful:", user);
      console.log("➡️ Redirecting back to:", from);
      navigate(from, { replace: true }); // 🔥 Go back to page before login
    } else {
      console.log("❌ Invalid credentials for:", form.identifier);
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative">
      {/* Back Arrow (top-left) */}
      <button
        className="absolute top-6 left-8"
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back"
        title="Back"
      >
        <span className="text-2xl text-black">&#8592;</span>
      </button>

      {/* Login Form */}
      <form
        className="flex flex-col items-center justify-center w-full px-4"
        style={{ maxWidth: 400 }}
        onSubmit={handleSubmit}
      >
        <h1 className="text-black font-bold text-3xl mb-8 text-center">Login</h1>

        <input
          type="text"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          placeholder="Phone number, email address or username"
          className="w-full h-12 px-4 mb-4 rounded border border-black focus:border-black focus:outline-none transition placeholder:text-gray-400"
          autoComplete="username"
        />

        <div className="relative w-full mb-2">
          <input
            type={showPwd ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full h-12 px-4 pr-10 rounded border border-black focus:border-black focus:outline-none transition placeholder:text-gray-400"
            autoComplete="current-password"
          />
          <span
            className="absolute right-3 top-[14px] cursor-pointer text-xl opacity-60"
            onClick={() => setShowPwd((v) => !v)}
            title="Toggle password visibility"
          >
            {showPwd ? <IoMdEyeOff /> : <IoMdEye />}
          </span>
        </div>

        <div className="w-full flex justify-center mt-0.5 mb-5">
          <span className="text-xs text-gray-400 text-center">
            Forgotten your login details?{" "}
            <a href="#" className="text-black font-semibold hover:underline">
              Get help with logging in.
            </a>
          </span>
        </div>

        <button
          type="submit"
          className="w-full max-w-xs h-12 bg-black text-white font-medium rounded transition hover:bg-gray-800"
        >
          Login
        </button>

        {error && <div className="text-red-500 text-xs mt-3">{error}</div>}
      </form>
    </div>
  );
}
