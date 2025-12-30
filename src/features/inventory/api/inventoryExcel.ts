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

export interface AnalyzeResult {
  headers: string[];
  preview: string[][];
  sheet: string;
  suggested_mapping?: Record<string, string>;
}

export interface ImportMapping {
  sku: string;
  part_number: string;
  quantity: string;
  unit_cost_ht: string;
  vat_rate: string;
  warehouse_code: string;
  movement_type: string;
  reference: string;
  comment: string;
  name: string;
  category: string;
  description: string;
  brand: string;
}

export interface ImportOptions {
  source_is_ttc: boolean;
  default_warehouse_id: string;
  default_vat: number;
}

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

export const analyzeInventoryExcel = async (file: File): Promise<AnalyzeResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<AnalyzeResult>("/inventory/import/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const finalizeInventoryImport = async (file: File, mapping: ImportMapping, options: ImportOptions): Promise<ImportResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mapping", JSON.stringify(mapping));
  formData.append("options", JSON.stringify(options));

  const response = await apiClient.post<ImportResult>("/inventory/import/finalize", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
