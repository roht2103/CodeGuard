import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("codeguard_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("codeguard_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("codeguard_token", payload.token);
    localStorage.setItem("codeguard_user", JSON.stringify(payload.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("codeguard_token");
    localStorage.removeItem("codeguard_user");
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
