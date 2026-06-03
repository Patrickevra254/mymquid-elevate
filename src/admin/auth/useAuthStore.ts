import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "../types";
import { authApi } from "../mock/api";

type AuthState = {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.login(email, password);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const status = (err as { response?: { status?: number } })?.response?.status;
          const message =
            status === 401 || status === 403
              ? "Invalid login details, please check and try again."
              : status === 429
              ? "Too many attempts. Please wait a moment and try again."
              : status && status >= 500
              ? "Server error. Please try again later."
              : "Login failed. Please check your connection and try again.";
          set({ error: message, isLoading: false });
        }
      },

      logout: async () => {
        await authApi.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "mymquid-admin-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
