import { apiClient } from "@/lib/api/axiosClient";
import type { CreateMotorcycleDTO, UpdateMotorcycleDTO, Motorcycle } from "../types/motorcycle.types";

const MOTORCYCLES_BASE_URL = "/motorcycles";

/**
 * Create a new motorcycle
 */
export const createMotorcycle = async (data: CreateMotorcycleDTO): Promise<Motorcycle> => {
  const payload = {
    plate_number: data.plate_number,
    brand: data.brand,
    model: data.model,
    energy_type: data.energy_type,
    status: data.status || "active",
  };
  
  const response = await apiClient.post<Motorcycle>(MOTORCYCLES_BASE_URL, payload);
  return response.data;
};

/**
 * Get all motorcycles
 */
export const getMotorcycles = async (params?: {
  status?: string;
  brand?: string;
  search?: string;
}): Promise<Motorcycle[]> => {
  const response = await apiClient.get<Motorcycle[]>(MOTORCYCLES_BASE_URL, { params });
  return response.data;
};

/**
 * Get a single motorcycle by ID
 */
export const getMotorcycle = async (id: string): Promise<Motorcycle> => {
  const response = await apiClient.get<Motorcycle>(`${MOTORCYCLES_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Update an existing motorcycle
 */
export const updateMotorcycle = async (data: UpdateMotorcycleDTO): Promise<Motorcycle> => {
  const { id, ...updateData } = data;
  
  const payload: any = {};
  
  if (updateData.plate_number) payload.plate_number = updateData.plate_number;
  if (updateData.brand) payload.brand = updateData.brand;
  if (updateData.model !== undefined) payload.model = updateData.model;
  if (updateData.energy_type) payload.energy_type = updateData.energy_type;
  if (updateData.status) payload.status = updateData.status;
  
  const response = await apiClient.put<Motorcycle>(`${MOTORCYCLES_BASE_URL}/${id}`, payload);
  return response.data;
};

/**
 * Delete a motorcycle
 */
export const deleteMotorcycle = async (id: string): Promise<void> => {
  await apiClient.delete(`${MOTORCYCLES_BASE_URL}/${id}`);
};

/**
 * Import motorcycles from Excel
 */
export const importMotorcycles = async (motorcycles: any[]): Promise<{
  success: number;
  failed: number;
  errors?: Array<{ row: number; message: string }>;
}> => {
  const response = await apiClient.post(`${MOTORCYCLES_BASE_URL}/import`, motorcycles);
  return response.data;
};
