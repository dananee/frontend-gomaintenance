import { apiClient } from "@/lib/api/axiosClient";
import { VehicleType } from "@/features/vehicles/types/vehicle.types";

export type VehicleDetailsResponse = {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    vin: string;
    plate_number: string;
    status: string;
    mileage: number;
    current_engine_hours?: number;
    meter_unit: "km" | "hours";
    type: string;
    vehicle_type?: VehicleType;
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
  maintenanceHistory?: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
    mileage: number;
    cost?: number;
    status: "completed" | "cancelled";
    technician?: string;
    assignees?: Array<{
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string;
    }>;
  }>;
  activityLog?: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    type?: string;
  }>;
  upcomingMaintenance?: Array<{
    id: string;
    title: string;
    description?: string;
    scheduled_date: string;
    status: string;
    priority: string;
    estimated_cost?: number;
    notes?: string;
    template?: {
      name: string;
    };
    assigned_user?: {
      first_name: string;
      last_name: string;
    };
  }>;
};

export const getVehicleDetails = async (
  vehicleId: string
): Promise<VehicleDetailsResponse> => {
  const response = await apiClient.get(`/vehicles/${vehicleId}/details`);
  return response.data;
};
