import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewScan from "./pages/NewScan.jsx";
import ScanDetail from "./pages/ScanDetail.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
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
          path="/scans/:id"
          element={
            <ProtectedRoute>
              <ScanDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
