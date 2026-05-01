import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { Button } from "./Button.jsx";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  // Determine current page name for breadcrumb
  let pageName = "Home";
  if (location.pathname.includes("dashboard")) pageName = "Dashboard Overview";
  else if (location.pathname.includes("repo-quality")) pageName = "Repo Scans";
  else if (location.pathname.includes("new-scan")) pageName = "New Repo Scan";
  else if (location.pathname.includes("docs")) pageName = "Documentation";
  else if (location.pathname.includes("privacy")) pageName = "Privacy Policy";
  else if (location.pathname.includes("terms")) pageName = "Terms of Service";
  else if (location.pathname.includes("login")) pageName = "Sign In";
  else if (location.pathname.includes("register")) pageName = "Create Account";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-[#0B1120]/80">
      <div className="flex h-16 items-center justify-between px-6 w-full">
        <div className="flex items-center gap-3">
          <Link
            to={token ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-gray-900 dark:text-white"
          >
            <div className="bg-blue-50 dark:bg-white/10 p-1.5 rounded-lg border border-blue-100 dark:border-white/10">
              <ShieldCheck className="text-blue-600 dark:text-indigo-400" size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight">CodeGuard</span>
          </Link>
          <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">/</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">{pageName}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {token ? (
            <>
              <Link to="/dashboard" className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-100 border border-gray-200 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
                Dashboard
              </Link>
              <Link to="/docs" className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-100 border border-gray-200 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
                Docs
              </Link>
              <button onClick={logout} className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-100 border border-gray-200 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
                Sign Out
              </button>
              <div className="hidden sm:flex items-center gap-2 pl-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name || "Rohit Thorat"}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-100 border border-gray-200 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-full bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
