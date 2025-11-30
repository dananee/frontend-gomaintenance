import apiClient from "@/lib/api/axiosClient";

export interface HealthResponse {
  status: string;
  service: string;
  timestamp?: string;
}

export interface VersionResponse {
  version: string;
  api_version: string;
}

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>("/health");
  return response.data;
};

export const getVersion = async (): Promise<VersionResponse> => {
  const response = await apiClient.get<VersionResponse>("/version");
  return response.data;
};
