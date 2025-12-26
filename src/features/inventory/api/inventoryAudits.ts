import apiClient from "@/lib/api/axiosClient";
import { InventoryAudit, InventoryAuditLine } from "../types/inventory.types";

export const getAudits = async (): Promise<InventoryAudit[]> => {
  const response = await apiClient.get<InventoryAudit[]>("/inventory/audits");
  return response.data;
};

export const getAudit = async (id: string): Promise<InventoryAudit> => {
  const response = await apiClient.get<InventoryAudit>(`/inventory/audits/${id}`);
  return response.data;
};

export const createAudit = async (data: { warehouse_id: string; name: string; description?: string }): Promise<InventoryAudit> => {
  const response = await apiClient.post<InventoryAudit>("/inventory/audits", data);
  return response.data;
};

export const updateAuditLines = async (id: string, lines: { part_id: string; physical_quantity: number; adjustment_reason?: string }[]): Promise<any> => {
  const response = await apiClient.put(`/inventory/audits/${id}/lines`, { lines });
  return response.data;
};

export const validateAudit = async (id: string): Promise<any> => {
  const response = await apiClient.post(`/inventory/audits/${id}/validate`);
  return response.data;
};
