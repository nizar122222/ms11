"use client";

import { create } from "zustand";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (v: boolean) => void;
}

function getStoredAuth() {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { user, token, isAuthenticated: true, isAdmin: user.role === "ADMIN" };
    }
  } catch {}
  return null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  _hasHydrated: false,

  setUser: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === "ADMIN",
      isLoading: false,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setHasHydrated: (v) => set({ _hasHydrated: v }),
}));

export { getStoredAuth };
