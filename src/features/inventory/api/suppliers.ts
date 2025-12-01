import apiClient from "@/lib/api/axiosClient";
import { Supplier } from "../types/inventory.types";

export interface GetSuppliersParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface GetSuppliersResponse {
  data: Supplier[];
  page: number;
  page_size: number;
  total: number;
}

export interface CreateSupplierRequest {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export const getSuppliers = async (params: GetSuppliersParams = {}): Promise<GetSuppliersResponse> => {
  const response = await apiClient.get<GetSuppliersResponse>("/suppliers", { params });
  return response.data;
};

export const getSupplier = async (id: string): Promise<Supplier> => {
  const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (data: CreateSupplierRequest): Promise<Supplier> => {
  const response = await apiClient.post<Supplier>("/suppliers", data);
  return response.data;
};

export const updateSupplier = async (id: string, data: UpdateSupplierRequest): Promise<Supplier> => {
  const response = await apiClient.put<Supplier>(`/suppliers/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await apiClient.delete(`/suppliers/${id}`);
};
