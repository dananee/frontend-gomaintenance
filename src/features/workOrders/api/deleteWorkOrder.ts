import apiClient from "@/lib/api/axiosClient";

export const deleteWorkOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`/work-orders/${id}`);
};
