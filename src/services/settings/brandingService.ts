import apiClient from "@/lib/api/axiosClient";

export interface BrandingSettings {
    primary_color: string;
    accent_color: string;
    logo_url: string;
}

export interface UpdateBrandingRequest {
    primary_color: string;
    accent_color: string;
    logo_url: string;
}

export const getBranding = async (): Promise<BrandingSettings> => {
    const response = await apiClient.get("/settings/branding");
    return response.data;
};

export const updateBranding = async (data: UpdateBrandingRequest): Promise<BrandingSettings> => {
    const response = await apiClient.put("/settings/branding", data);
    return response.data;
};

export const uploadLogo = async (file: File): Promise<{ logo_url: string }> => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await apiClient.post("/settings/branding/logo", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
