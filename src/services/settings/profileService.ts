import apiClient from "@/lib/api/axiosClient";

export interface ProfileData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    job_title: string;
    phone: string;
    department: string;
    bio?: string;
    avatar_url?: string;
    role: string;
}

export interface UpdateProfileRequest {
    first_name: string;
    last_name: string;
    job_title: string;
    bio: string;
}

export const getProfile = async (): Promise<ProfileData> => {
    const response = await apiClient.get("/settings/profile");
    return response.data;
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<ProfileData> => {
    const response = await apiClient.put("/settings/profile", data);
    return response.data;
};

export const uploadAvatar = async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.post("/settings/profile/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
