"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import useTokenManagement from "@/components/hooks/useTokenManagement";
import { parseToken } from "@/lib/token";

const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: () => false,
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const { accessToken, clearTokens, isAuthenticated } = useTokenManagement();

  useEffect(() => {
    setCurrentUser(isAuthenticated() ? parseToken(accessToken) : null);
  }, [accessToken]);

  function logout() {
    clearTokens();
    setCurrentUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
