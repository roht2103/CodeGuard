import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import clsx from "clsx";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  const isAuthRoute = ["/login", "/register"].includes(location.pathname);

  const navLinkClass = (path) =>
    clsx(
      "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-indigo-400",
      location.pathname === path
        ? "text-blue-600 dark:text-indigo-400"
        : "text-gray-600 dark:text-gray-300"
    );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <Link
          to={token ? "/dashboard" : "/login"}
          className="flex items-center gap-2 text-gray-900 dark:text-white"
        >
          <ShieldCheck className="text-blue-600 dark:text-indigo-500" size={28} />
          <span className="text-xl font-semibold tracking-tight">CodeGuard</span>
        </Link>
        <div className="flex items-center gap-6">
          {token ? (
            <>
              <div className="hidden md:flex items-center gap-6 mr-4">
                <Link className={navLinkClass("/dashboard")} to="/dashboard">
                  Dashboard
                </Link>
                <Link className={navLinkClass("/new-scan")} to="/new-scan">
                  New Scan
                </Link>
                <Link className={navLinkClass("/repo-quality")} to="/repo-quality">
                  Repo Quality
                </Link>
              </div>
              <ThemeToggle />
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
                {user?.name || "User"}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              {!isAuthRoute && (
                <Link
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-indigo-400 ml-4"
                  to="/login"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
