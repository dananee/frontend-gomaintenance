import apiClient from "@/lib/api/axiosClient";

export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  type: string;
  name: string;
  file_url: string;
  uploaded_at: string;
}

export interface AddVehicleDocumentRequest {
  type: string;
  name: string;
  file_url: string;
}

// Get all documents for a vehicle
export const getVehicleDocuments = async (vehicleId: string): Promise<VehicleDocument[]> => {
  const response = await apiClient.get<VehicleDocument[]>(`/vehicles/${vehicleId}/documents`);
  return response.data;
};

// Add a document to a vehicle
export const addVehicleDocument = async (
  vehicleId: string,
  data: AddVehicleDocumentRequest
): Promise<VehicleDocument> => {
  const response = await apiClient.post<VehicleDocument>(`/vehicles/${vehicleId}/documents`, data);
  return response.data;
};

// Delete a vehicle document
export const deleteVehicleDocument = async (vehicleId: string, docId: string): Promise<void> => {
  await apiClient.delete(`/vehicles/${vehicleId}/documents/${docId}`);
};
