/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

//Auth is basically making sure that you are who you claiming to be
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    const userDataJson = JSON.stringify(userData)
    localStorage.setItem("user", userDataJson);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const provider = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={provider}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
