import axios from "axios";
import { refreshToken as refreshTokenRequest } from "@/features/auth/api/refreshToken";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    const authStore = useAuthStore.getState();

    // Handle 401 Unauthorized with refresh token
    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshTokenRequest(refreshToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${refreshed.token}`;
        authStore.setTokens(refreshed.token, refreshed.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${refreshed.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        authStore.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle 401 Unauthorized
    return Promise.reject(error);
  }
);

export default apiClient;
