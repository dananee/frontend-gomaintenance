import apiClient from "@/lib/api/axiosClient";

export interface CompanyData {
    name: string;
    website: string;
    address: string;
    city: string;
    country: string;
    kanban_completed_days_retention?: number;
}

export interface UpdateCompanyRequest {
    name: string;
    website: string;
    address: string;
    city: string;
    country: string;
    kanban_completed_days_retention?: number;
}

export const getCompany = async (): Promise<CompanyData> => {
    const response = await apiClient.get("/settings/company");
    return response.data;
};

export const updateCompany = async (data: UpdateCompanyRequest): Promise<CompanyData> => {
    const response = await apiClient.put("/settings/company", data);
    return response.data;
};
