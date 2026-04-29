import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewScan from "./pages/NewScan.jsx";
import ScanDetail from "./pages/ScanDetail.jsx";
import RepoQuality from "./pages/RepoQuality.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<Landing />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-scan"
            element={
              <ProtectedRoute>
                <NewScan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repo-quality"
            element={
              <ProtectedRoute>
                <RepoQuality />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scans/:id"
            element={
              <ProtectedRoute>
                <ScanDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
