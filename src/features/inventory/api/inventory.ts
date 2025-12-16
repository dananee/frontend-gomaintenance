import apiClient from '@/lib/api/axiosClient';
import { StockMovement } from '../types/inventory.types';

export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateWarehouseRequest {
  name: string;
  location?: string;
  capacity?: number;
}

export interface UpdateWarehouseRequest {
  name?: string;
  location?: string;
  capacity?: number;
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

export interface AddStockRequest {
  part_id: string;
  quantity: number;
  min_quantity?: number;
  location_in_warehouse?: string;
}

export interface UpdateStockRequest {
  quantity?: number;
  min_quantity?: number;
  location_in_warehouse?: string;
}

export interface CreateStockMovementRequest {
  part_id: string;
  from_warehouse_id?: string;
  to_warehouse_id?: string;
  quantity: number;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  reference_id?: string;
  notes?: string;
}

// Warehouses
export const getWarehouses = async (): Promise<Warehouse[]> => {
  const response = await apiClient.get('/warehouses');
  // Unwrap paginated response
  return (response.data as any).data || response.data;
};

export const getWarehouse = async (id: string): Promise<Warehouse> => {
  const response = await apiClient.get(`/warehouses/${id}`);
  return response.data;
};

export const createWarehouse = async (data: CreateWarehouseRequest): Promise<Warehouse> => {
  const response = await apiClient.post('/warehouses', data);
  return response.data;
};

export const updateWarehouse = async (id: string, data: UpdateWarehouseRequest): Promise<Warehouse> => {
  const response = await apiClient.put(`/warehouses/${id}`, data);
  return response.data;
};

export const deleteWarehouse = async (id: string): Promise<void> => {
  await apiClient.delete(`/warehouses/${id}`);
};

// Warehouse Stock
export const getWarehouseStock = async (warehouseId: string): Promise<StockItem[]> => {
  const response = await apiClient.get(`/warehouses/${warehouseId}/stock`);
  return response.data;
};

export const addWarehouseStock = async (warehouseId: string, data: AddStockRequest): Promise<StockItem> => {
  const response = await apiClient.post(`/warehouses/${warehouseId}/stock`, data);
  return response.data;
};

export const updateWarehouseStock = async (warehouseId: string, stockId: string, data: UpdateStockRequest): Promise<StockItem> => {
  const response = await apiClient.patch(`/warehouses/${warehouseId}/stock/${stockId}`, data);
  return response.data;
};

// Stock Movements
// Stock Movements
export const getStockMovements = async (params?: { part_id?: string; warehouse_id?: string; type?: string }): Promise<StockMovement[]> => {
  const response = await apiClient.get('/stock-movements', { params });
  // Unwrap paginated response
  return (response.data as any).data || response.data;
};

export const createStockMovement = async (data: CreateStockMovementRequest): Promise<StockMovement> => {
  const response = await apiClient.post('/stock-movements', data);
  return response.data;
};
