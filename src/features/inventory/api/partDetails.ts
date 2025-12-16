import apiClient from '@/lib/api/axiosClient';
import { InventoryStock, PartDocument, PartComment } from '../types/inventory.types';

export const getPartStock = async (partId: string): Promise<InventoryStock[]> => {
  const response = await apiClient.get(`/parts/${partId}/stock`);
  return response.data;
};

export const getPartDocuments = async (partId: string): Promise<PartDocument[]> => {
  const response = await apiClient.get(`/parts/${partId}/documents`);
  return response.data;
};

export const addPartDocument = async (partId: string, data: { name: string, file_url: string, file_size?: number, media_type?: string }): Promise<PartDocument> => {
   const response = await apiClient.post(`/parts/${partId}/documents`, data);
   return response.data;
};

export const deletePartDocument = async (partId: string, docId: string): Promise<void> => {
   await apiClient.delete(`/parts/${partId}/documents/${docId}`);
};

export const getPartComments = async (partId: string): Promise<PartComment[]> => {
   const response = await apiClient.get(`/parts/${partId}/comments`);
   return response.data;
};

export const addPartComment = async (partId: string, text: string): Promise<PartComment> => {
   const response = await apiClient.post(`/parts/${partId}/comments`, { text });
   return response.data;
};

export const adjustPartStock = async (data: any): Promise<any> => {
   // Assuming endpoint is POST /stock-movements since it is shared
   const response = await apiClient.post('/stock-movements', data);
   return response.data;
};

export const updatePart = async (partId: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/parts/${partId}`, data);
    return response.data;
};
