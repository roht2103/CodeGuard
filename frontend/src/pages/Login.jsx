import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Card } from "../components/Card.jsx";
import { Button } from "../components/Button.jsx";

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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Sign in to CodeGuard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Keep your codebase healthy and secure.
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
              variant="primary"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            New here?{" "}
            <Link
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
