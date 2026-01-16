import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const saveSession = (token, user) => {
    localStorage.setItem("creatorlab_token", token);
    localStorage.setItem("creatorlab_user", JSON.stringify(user));
  };

  // ✅ Normal Email Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
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

      saveSession(data.token, data.user);

      setMessage("✅ Login successful! Redirecting...");
      setLoading(false);

      setTimeout(() => navigate("/caption"), 900);
    } catch (err) {
      setError("❌ Server not reachable. Try again.");
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // 🔥 Send Google user to backend so backend creates user + returns JWT
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Google login failed ❌");
        setGoogleLoading(false);
        return;
      }

      saveSession(data.token, data.user);

      setMessage("✅ Google login successful! Redirecting...");
      setGoogleLoading(false);

      setTimeout(() => navigate("/caption"), 900);
    } catch (err) {
      setError("❌ Google login cancelled or failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border p-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-1">
          Login to access CreatorLab tools 🚀
        </p>

        {/* ✅ Messages */}
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

        {/* ✅ Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className={`mt-5 w-full py-2 rounded-lg font-semibold border transition flex items-center justify-center gap-2 ${
            googleLoading
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="text-sm font-medium text-gray-700">Password</label>

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
