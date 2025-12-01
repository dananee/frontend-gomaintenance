import { apiClient } from "@/lib/api/axiosClient";

export type VehicleDetailsResponse = {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    licensePlate: string;
    status: string;
    mileage: number;
  };
  metrics: {
    totalMaintenanceCost: number;
    averageRepairCost: number;
    totalWorkOrders: number;
    totalDowntimeHours: number;
    mttr: number;
    mtbf: number;
    costPerKm: number;
    reliabilityScore: number;
  };
  serviceSummary: {
    lastMaintenanceDate: string | null;
    lastMaintenanceCost: number;
    lastTechnicianName: string;
    nextServiceDue: string | null;
    serviceInterval: string;
  };
  charts: {
    maintenanceCostTrend: Array<{ date: string; value: number }>;
    downtimeTrend: Array<{ date: string; value: number }>;
    workOrderDistribution: Array<{ name: string; value: number; color?: string }>;
    mileageGrowth: Array<{ date: string; value: number }>;
  };
  partsUsed: Array<{
    partName: string;
    quantity: number;
    cost: number;
    dateUsed: string;
    workOrderId: string;
  }>;
};

export const getVehicleDetails = async (
  vehicleId: string
): Promise<VehicleDetailsResponse> => {
  const response = await apiClient.get(`/vehicles/${vehicleId}/details`);
  return response.data;
};
