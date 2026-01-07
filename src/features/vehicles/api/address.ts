import apiClient from "@/lib/api/axiosClient";

export interface Region {
  id: number;
  region: string;
}

export interface Ville {
  id: number;
  ville: string;
  region_id: number;
  region_data?: Region;
}

export const getRegions = async (): Promise<Region[]> => {
  const response = await apiClient.get<Region[]>("/regions");
  return response.data;
};

export const getVilles = async (regionId?: number): Promise<Ville[]> => {
  const params = regionId ? { region_id: regionId } : {};
  const response = await apiClient.get<Ville[]>("/villes", { params });
  return response.data;
};
