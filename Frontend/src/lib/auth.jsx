import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "coderefiner.auth.v1";

const AuthContext = createContext(null);

function readInitial() {
  try {
    return window.localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, isAuthenticated ? "true" : "false");
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false),
      setIsAuthenticated,
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

