import apiClient from "@/lib/api/axiosClient";
import { Department, CreateDepartmentDTO, UpdateDepartmentDTO } from "../types/department";

export const getDepartments = async (): Promise<Department[]> => {
  const response = await apiClient.get<Department[]>("/departments");
  return response.data;
};

export const createDepartment = async (data: CreateDepartmentDTO): Promise<Department> => {
  const response = await apiClient.post<Department>("/departments", data);
  return response.data;
};

export const updateDepartment = async (id: string, data: UpdateDepartmentDTO): Promise<Department> => {
  const response = await apiClient.put<Department>(`/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await apiClient.delete(`/departments/${id}`);
};
