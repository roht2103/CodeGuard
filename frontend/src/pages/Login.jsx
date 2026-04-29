import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });
      login(response.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="gradient-border w-full max-w-md">
        <div className="bg-panel rounded-2xl p-8">
          <h1 className="text-2xl font-semibold">Sign in to CodeGuard</h1>
          <p className="text-sm text-mist/70 mt-2">Keep your codebase healthy and secure.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-mist/70">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
                required
              />
            </div>
            <div>
              <label className="text-sm text-mist/70">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-tide text-ink py-2 font-semibold hover:bg-tide/90 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-sm text-mist/70 mt-6">
            New here?{" "}
            <Link className="text-neon hover:underline" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
