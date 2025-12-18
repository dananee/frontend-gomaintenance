import axiosClient from "@/lib/api/axiosClient";

export interface Role {
    role: string;
    description: string;
    permissions_count: number;
    permissions?: Record<string, string[]>;
}

export const getRoles = async (): Promise<Role[]> => {
    const response = await axiosClient.get("/roles");
    return response.data;
};

export const getRole = async (role: string): Promise<Role> => {
    const response = await axiosClient.get(`/roles/${role}`);
    return response.data;
};

export const updateRolePermissions = async (role: string, permissions: Record<string, string[]>): Promise<Role> => {
    const response = await axiosClient.put(`/roles/${role}/permissions`, { permissions });
    return response.data;
};

export const createRole = async (name: string, description: string): Promise<Role> => {
    const response = await axiosClient.post("/roles", { name, description });
    return response.data;
};

export const deleteRole = async (roleName: string): Promise<void> => {
    const response = await axiosClient.delete(`/roles/${roleName}`);
    return response.data;
};
