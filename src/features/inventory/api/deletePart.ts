import apiClient from "@/lib/api/axiosClient";

export const deletePart = async (id: string): Promise<void> => {
  await apiClient.delete(`/parts/${id}`);
};
