import apiClient from "@/lib/api/axiosClient";

export interface TelematicsMileageData {
  vehicle_id: string;
  mileage: number;
  timestamp: string;
}

export interface AccountingExportRequest {
  from_date: string;
  to_date: string;
  export_format?: "csv" | "json" | "excel";
}

export interface AccountingExportResponse {
  export_url: string;
  export_id: string;
  created_at: string;
}

// Receive telematics mileage data
export const receiveTelematicsMileage = async (
  data: TelematicsMileageData
): Promise<void> => {
  await apiClient.post("/integrations/telematics/mileage", data);
};

// Export data to accounting system
export const exportToAccounting = async (
  data: AccountingExportRequest
): Promise<AccountingExportResponse> => {
  const response = await apiClient.post<AccountingExportResponse>(
    "/integrations/accounting/export",
    data
  );
  return response.data;
};
