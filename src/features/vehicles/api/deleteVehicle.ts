import apiClient from "@/lib/api/axiosClient";

export const deleteVehicle = async (id: string): Promise<void> => {
  await apiClient.delete(`/vehicles/${id}`);
};
