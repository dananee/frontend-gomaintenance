import apiClient from '@/lib/api/axiosClient';

export interface CreatePartCategoryRequest {
    name: string;
}

export interface PartCategory {
    id: string;
    name: string;
    tenant_id: string;
}

export const createPartCategory = async (data: CreatePartCategoryRequest): Promise<PartCategory> => {
    const response = await apiClient.post('/part-categories', data);
    return response.data;
};
