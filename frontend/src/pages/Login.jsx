import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed ❌");
        setLoading(false);
        return;
      }

      // ✅ Save token + user in localStorage
      localStorage.setItem("creatorlab_token", data.token);
      localStorage.setItem("creatorlab_user", JSON.stringify(data.user));

      setMessage("✅ Login successful! Redirecting...");
      setLoading(false);

      setTimeout(() => {
        navigate("/caption");
      }, 1200);
    } catch (err) {
      setError("❌ Server not reachable. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border p-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-1">
          Login to access CreatorLab tools 🚀
        </p>

        {/* ✅ Success / Error Message */}
        {message && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="mt-1 flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-gray-900">
              <input
                type={showPass ? "text" : "password"}
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-sm text-gray-600 hover:text-gray-900 ml-2"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-900 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
