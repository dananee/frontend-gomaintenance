import { apiClient } from "@/lib/api/axiosClient";

export const getInventoryImportTemplate = async () => {
  const response = await apiClient.get("/inventory/import/template", {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "inventory_import_template.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportInventoryExcel = async (locale: string = "en") => {
  const response = await apiClient.get(`/inventory/export/excel?locale=${locale}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `inventory_export_${locale}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export interface ImportResult {
  success_count: number;
  failed_count: number;
  errors?: {
    row: number;
    field?: string;
    message: string;
  }[];
}

export const importInventoryExcel = async (file: File): Promise<ImportResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ImportResult>("/inventory/import/excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
