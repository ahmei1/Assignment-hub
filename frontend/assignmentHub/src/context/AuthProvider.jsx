/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";

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

  const sessionVersion = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const version = sessionVersion.current;
    const checkUser = async () => {
      try {
        const response = await api.get("/auth/me", { signal: controller.signal, timeout: 70000 });
        if (version !== sessionVersion.current || controller.signal.aborted) return;
        setUser(response.data.data.user);
      } catch {
        if (version !== sessionVersion.current || controller.signal.aborted) return;
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        if (!controller.signal.aborted) setAuthLoading(false);
      }
    };

    checkUser();
    return () => controller.abort();
  }, []);

  const login = (userData) => {
    sessionVersion.current += 1;
    setAuthLoading(false);
    const userDataJson = JSON.stringify(userData);
    localStorage.setItem("user", userDataJson);
    setUser(userData);
  };

  const logout = () => {
    sessionVersion.current += 1;
    setAuthLoading(false);
    localStorage.removeItem("user");
    setUser(null);
  };

  // Same mechanics as login (sync context + localStorage), used after the
  // user edits their profile instead of authenticating.
  const updateUser = (userData) => {
    sessionVersion.current += 1;
    setAuthLoading(false);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const provider = useMemo(
    () => ({ user, authLoading, login, logout, updateUser }),
    [user, authLoading],
  );

  return (
    <AuthContext.Provider value={provider}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
