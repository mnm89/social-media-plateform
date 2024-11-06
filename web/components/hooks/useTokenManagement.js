"use client";
import { useEffect, useState, useTransition } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/lib/token";
import { refreshToken } from "@/actions/refresh";

const useTokenManagement = () => {
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let lastActivityTime = Date.now();
    let refreshInterval;

    const refreshTokens = async () => {
      if (isTokenExpired(Cookies.get("access_token"))) {
        startTransition(async () => {
          try {
            const { access_token, refresh_token } = await refreshToken();
            Cookies.set("access_token", access_token);
            Cookies.set("refresh_token", refresh_token);
          } catch (err) {
            router.push("/login");
          }
        });
      }
    };

    const resetActivity = () => {
      lastActivityTime = Date.now();
    };

    const checkInactivity = () => {
      const inactivityLimit = 5 * 60 * 1000; // 5 minutes
      if (Date.now() - lastActivityTime > inactivityLimit) {
        setIsActive(false);
        router.push("/login"); // Redirect to login if inactive
      }
    };

    const startRefreshInterval = () => {
      refreshInterval = setInterval(() => {
        refreshTokens();
      }, 1000 * 60); // Refresh every minute
    };

    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keydown", resetActivity);
    window.addEventListener("focus", startRefreshInterval);
    window.addEventListener("blur", () => clearInterval(refreshInterval));

    startRefreshInterval();

    const inactivityCheck = setInterval(checkInactivity, 1000 * 60);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(inactivityCheck);
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keydown", resetActivity);
      window.removeEventListener("focus", startRefreshInterval);
      window.removeEventListener("blur", () => clearInterval(refreshInterval));
    };
  }, [router]);

  return { isActive, isPending };
};

export default useTokenManagement;
