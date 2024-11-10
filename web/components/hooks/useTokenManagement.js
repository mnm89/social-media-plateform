"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import { isTokenExpired } from "@/lib/token";
import { refreshToken as refreshTokenAction } from "@/actions/auth";

const useTokenManagement = () => {
  const [accessToken, setAccessToken] = useState(() =>
    Cookies.get("access_token")
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    Cookies.get("refresh_token")
  );
  const [isPending, startTransition] = useTransition();

  const isAuthenticated = () => !!accessToken && !isTokenExpired(accessToken);

  const setTokens = useCallback((tokens) => {
    const { access_token, refresh_token } = tokens;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    Cookies.set("access_token", access_token);
    Cookies.set("refresh_token", refresh_token);
  }, []);

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  };

  const refreshAccessToken = useCallback(() => {
    if (!!refreshToken)
      startTransition(async () => {
        try {
          const tokens = await refreshTokenAction(refreshToken);
          setTokens(tokens);
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          clearTokens();
        }
      });
  }, [refreshToken, setTokens]);

  useEffect(() => {
    // Auto-refresh logic
    const intervalId = setInterval(async () => {
      await refreshAccessToken();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, [refreshAccessToken]);

  return { isAuthenticated, isPending, clearTokens, accessToken, refreshToken };
};

export default useTokenManagement;
