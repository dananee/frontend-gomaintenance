import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddVehicleDocumentRequest,
  addVehicleDocument,
  deleteVehicleDocument,
  getVehicleDocuments,
  VehicleDocument,
} from "../api/vehicleDocuments";

export const useVehicleDocuments = (vehicleId: string) =>
  useQuery<VehicleDocument[]>({
    queryKey: ["vehicle-documents", vehicleId],
    queryFn: () => getVehicleDocuments(vehicleId),
    enabled: !!vehicleId,
  });

export const useUploadVehicleDocument = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddVehicleDocumentRequest) =>
      addVehicleDocument(vehicleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", vehicleId] });
    },
  });
};

export const useDeleteVehicleDocument = (vehicleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string) => deleteVehicleDocument(vehicleId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", vehicleId] });
    },
  });
};
