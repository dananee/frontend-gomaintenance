import apiClient from "@/lib/api/axiosClient";

export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  document_type: string;
  file_name: string;
  file_size?: number;
  name: string;
  file_url: string;
  uploaded_at?: string; // Mapped from created_at
  created_at?: string;
  expiry_date?: string;
}

export interface AddVehicleDocumentRequest {
  document_type: string;
  file_name: string;
  file_size?: number;
  name: string;
  file_url: string;
  expiry_date?: string;
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

// Generic file upload
export const uploadFile = async (file: File): Promise<{ url: string; fileName: string; fileSize: number }> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await apiClient.post<{ url: string; fileName: string; fileSize: number }>(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  
  return response.data;
};
