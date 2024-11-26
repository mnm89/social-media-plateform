"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useTransition,
} from "react";

import useTokenManagement from "@/components/hooks/useTokenManagement";
import { parseToken } from "@/lib/token";
import { logoutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  currentUser: null,
  logout: () => {},
});

export function AuthProvider({ children, user }) {
  const [currentUser, setCurrentUser] = useState(user);
  const { accessToken, clearTokens } = useTokenManagement();
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(accessToken ? parseToken(accessToken) : null);
  }, [accessToken]);

  function logout() {
    router.replace("/");
    startTransition(async () => {
      await logoutAction();
      clearTokens();
      setCurrentUser(null);
      router.refresh();
    });
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
