import apiClient from "@/lib/api/axiosClient";

export interface OdooStatus {
    is_connected: boolean;
    base_url?: string;
    database?: string;
    last_sync_at?: string;
}

export interface ConnectOdooRequest {
    base_url: string;
    database: string;
    api_key: string;
}

export const getOdooStatus = async (): Promise<OdooStatus> => {
    const response = await apiClient.get("/integrations/odoo");
    return response.data;
};

export const connectOdoo = async (data: ConnectOdooRequest): Promise<{ message: string }> => {
    const response = await apiClient.post("/integrations/odoo/connect", data);
    return response.data;
};

export const testOdooConnection = async (): Promise<{ message: string; latency: string }> => {
    const response = await apiClient.post("/integrations/odoo/test");
    return response.data;
};

export const disconnectOdoo = async (): Promise<{ message: string }> => {
    const response = await apiClient.delete("/integrations/odoo");
    return response.data;
};
