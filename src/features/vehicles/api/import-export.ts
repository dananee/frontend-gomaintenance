import { apiClient } from "@/lib/api/axiosClient";
import type { ImportResult } from "../types/import";

/**
 * Import vehicles from an Excel file
 */
export const importVehicles = async (file: File): Promise<ImportResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ImportResult>(
    "/vehicles/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Export all vehicles to Excel
 */
export const exportVehicles = async (locale: string = "en"): Promise<Blob> => {
  const response = await apiClient.get(`/vehicles/export?lang=${locale}`, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Download the vehicle import template
 */
export const downloadTemplate = async (locale: string = "en"): Promise<Blob> => {
  const response = await apiClient.get(`/vehicles/import/template?lang=${locale}`, {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Helper function to trigger file download
 */
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
