import apiClient from "@/lib/api/axiosClient";

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
