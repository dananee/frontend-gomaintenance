import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/lib/rbac/permissions";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_active?: boolean;
  avatar?: string;
  name?: string;
  tenant_id?: string;
  tenant_name?: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setTokens: (token: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken) => {
        if (!token) {
          console.error("Attempted to login with empty token");
          throw new Error("Cannot login: token is required");
        }
        if (!user) {
          console.error("Attempted to login with empty user");
          throw new Error("Cannot login: user is required");
        }

        console.log("Storing auth token in localStorage and Zustand...");
        localStorage.setItem("auth_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        set({ user, token, refreshToken: refreshToken ?? null, isAuthenticated: true });
        console.log("Auth state updated successfully", {
          userId: user.id,
          userEmail: user.email,
          isAuthenticated: true
        });
      },

      logout: () => {
        // Clear cookies via API endpoint
        fetch("/api/auth/set-cookie", {
          method: "DELETE",
        }).catch((error) => {
          console.error("Failed to clear auth cookies:", error);
        });

        // Clear localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setTokens: (token, refreshToken) => {
        localStorage.setItem("auth_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        set((state) => ({
          token,
          refreshToken: refreshToken ?? state.refreshToken,
          isAuthenticated: true,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
