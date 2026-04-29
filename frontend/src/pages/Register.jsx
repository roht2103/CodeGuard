import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      login(response.data);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="gradient-border w-full max-w-md">
        <div className="bg-panel rounded-2xl p-8">
          <h1 className="text-2xl font-semibold">
            Create your CodeGuard account
          </h1>
          <p className="text-sm text-mist/70 mt-2">
            Monitor quality trends across every scan.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-mist/70">Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-lg bg-ink/60 border border-tide/30 px-3 py-2 focus:outline-none focus:border-tide"
                required
              />
            </div>
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
              className="w-full rounded-lg bg-neon text-ink py-2 font-semibold hover:bg-neon/90 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className="text-sm text-mist/70 mt-6">
            Already have an account?{" "}
            <Link className="text-neon hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
