import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const location = useLocation();

  const isAuthRoute = ["/login", "/register"].includes(location.pathname);

  return (
    <nav className="px-6 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to={token ? "/dashboard" : "/login"} className="flex items-center gap-2">
          <ShieldCheck className="text-neon" size={28} />
          <span className="text-xl font-semibold tracking-wide">CodeGuard</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {token ? (
            <>
              <Link className="hover:text-tide" to="/dashboard">
                Dashboard
              </Link>
              <Link className="hover:text-tide" to="/new-scan">
                New Scan
              </Link>
              <span className="text-tide hidden sm:inline">{user?.name || "User"}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-tide/40 px-3 py-1 text-tide hover:bg-tide/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            !isAuthRoute && (
              <Link className="hover:text-tide" to="/login">
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
