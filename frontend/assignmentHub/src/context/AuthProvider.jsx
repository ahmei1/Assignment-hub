/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import Loader from "../components/Loader";

//Auth is basically making sure that you are who you claiming to be
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data.user);
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
        console.log(error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = (userData) => {
    const userDataJson = JSON.stringify(userData);
    localStorage.setItem("user", userDataJson);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Same mechanics as login (sync context + localStorage), used after the
  // user edits their profile instead of authenticating.
  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const provider = {
    user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={provider}>
      {authLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
