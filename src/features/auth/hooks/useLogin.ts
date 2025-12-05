import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginCredentials } from "../types/auth.types";

export function useLogin() {
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: async (data) => {
      // Validate response data before proceeding
      if (!data.token || !data.user) {
        console.error("Login response missing required fields:", {
          hasToken: !!data.token,
          hasUser: !!data.user
        });
        throw new Error("Invalid login response: missing token or user data");
      }

      console.log("Login successful, storing authentication data...");

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
          const errorText = await setCookieResponse.text();
          console.error(`Failed to set authentication cookies: ${setCookieResponse.status}`, errorText);
          throw new Error(`Failed to set authentication cookies: ${setCookieResponse.status}`);
        }

        console.log("Cookies set successfully");
      } catch (error) {
        console.error("Failed to set auth cookies:", error);
        // Continue anyway - localStorage will be the fallback
      }

      // Store in localStorage and Zustand for client-side access
      // This must happen BEFORE redirect
      setAuth(data.user, data.token, data.refreshToken);
      console.log("Auth state updated, redirecting to dashboard...");

      // Small delay to ensure state is persisted before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use window.location.href instead of router.push to force a full page reload
      // This ensures the proxy middleware runs with the newly set cookies
      window.location.href = "/dashboard";
    },
  });
}
