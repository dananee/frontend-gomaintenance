import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginCredentials } from "../types/auth.types";

export function useLogin() {
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: async (data) => {
      // Set cookies via API endpoint for httpOnly security
      try {
        const setCookieResponse = await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: data.token,
            refreshToken: data.refreshToken,
          }),
        });

        if (!setCookieResponse.ok) {
          throw new Error(`Failed to set authentication cookies: ${setCookieResponse.status}`);
        }

        // Also store in localStorage and Zustand for client-side access
        setAuth(data.user, data.token, data.refreshToken);

        // Use window.location.href instead of router.push to force a full page reload
        // This ensures the proxy middleware runs with the newly set cookies
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Failed to set auth cookies:", error);
        // Still try to navigate even if cookie setting fails
        // (user will have localStorage token as fallback)
        setAuth(data.user, data.token, data.refreshToken);
        window.location.href = "/dashboard";
      }
    },
  });
}
