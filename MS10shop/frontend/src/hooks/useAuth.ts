"use client";

import { useEffect, useRef } from "react";
import { useAuthStore, getStoredAuth } from "@/store/authStore";
import { authAPI } from "@/lib/api";

export function useAuthInit() {
  const { setUser, setLoading, logout, setHasHydrated } = useAuthStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user, stored.token);
      setHasHydrated(true);
      authAPI
        .getMe()
        .then(({ data }) => {
          setUser(data.user, stored.token);
        })
        .catch(() => {
          logout();
        });
    } else {
      setLoading(false);
      setHasHydrated(true);
    }
  }, []);
}
