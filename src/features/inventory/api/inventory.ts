import apiClient from '@/lib/api/axiosClient';
import { StockMovement } from '../types/inventory.types';

export interface Warehouse {
  id: string;
  name: string;
  type: 'MAIN' | 'SITE' | 'VAN';
  address?: string;
  manager_id?: string;
  allow_negative_stock: boolean;
  active: boolean;
  manager?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateWarehouseRequest {
  name: string;
  type: 'MAIN' | 'SITE' | 'VAN';
  address?: string;
  manager_id?: string;
  allow_negative_stock?: boolean;
}

export interface UpdateWarehouseRequest extends Partial<CreateWarehouseRequest> {
  active?: boolean;
}

export interface StockItem {
  id: string;
  warehouse_id: string;
  part_id: string;
  quantity: number;
  min_quantity: number;
  location_in_warehouse?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStockMovementRequest {
  part_id: string;
  warehouse_id?: string;
  to_warehouse_id?: string;
  quantity: number;
  movement_type: string;
  reason?: string;
  notes?: string;
}

// Warehouses
export const getWarehouses = async (params?: { active?: boolean; page?: number; page_size?: number }): Promise<{ data: Warehouse[], total: number }> => {
  const response = await apiClient.get('/settings/inventory/warehouses', { params });
  return response.data;
};

export const getActiveWarehouses = async (): Promise<Warehouse[]> => {
  const response = await apiClient.get('/settings/inventory/warehouses/active');
  return response.data;
};

export const getWarehouse = async (id: string): Promise<Warehouse> => {
  const response = await apiClient.get(`/settings/inventory/warehouses/${id}`);
  return response.data;
};

export const createWarehouse = async (data: CreateWarehouseRequest): Promise<Warehouse> => {
  const response = await apiClient.post('/settings/inventory/warehouses', data);
  return response.data;
};

export const updateWarehouse = async (id: string, data: UpdateWarehouseRequest): Promise<Warehouse> => {
  const response = await apiClient.put(`/settings/inventory/warehouses/${id}`, data);
  return response.data;
};

export const deleteWarehouse = async (id: string): Promise<void> => {
  // Soft deactivate via the delete method on backend
  await apiClient.delete(`/settings/inventory/warehouses/${id}`);
};

// Warehouse Stock
export const getWarehouseStock = async (warehouseId: string): Promise<StockItem[]> => {
  const response = await apiClient.get(`/settings/inventory/warehouses/${warehouseId}/stock`);
  return response.data;
};

// Stock Movements
export const getStockMovements = async (params?: { 
  part_id?: string; 
  warehouse_id?: string; 
  type?: string;
  start_date?: string;
  end_date?: string;
}): Promise<StockMovement[]> => {
  const response = await apiClient.get('/stock-movements', { params });
  // Unwrap paginated response
  return (response.data as any).data || (response.data as any).items || response.data;
};

export const createStockMovement = async (data: CreateStockMovementRequest): Promise<StockMovement> => {
  const response = await apiClient.post('/stock-movements', data);
  return response.data;
};
