import apiClient from "@/lib/api/axiosClient";

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
