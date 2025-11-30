import apiClient from '@/lib/api/axiosClient';

export interface MaintenanceCostReport {
  total_cost: number;
  labor_cost: number;
  parts_cost: number;
  external_service_cost: number;
  work_order_count: number;
}

export interface FleetAvailabilityReport {
  total_vehicles: number;
  active_vehicles: number;
  in_maintenance_vehicles: number;
  inactive_vehicles: number;
  availability_percent: number;
}

export interface BreakdownReport {
  // Define based on backend response if known, otherwise generic
  [key: string]: any;
}

export interface TechnicianProductivityReport {
  // Define based on backend response
  [key: string]: any;
}

export interface UpcomingMaintenanceReport {
  // Define based on backend response
  [key: string]: any;
}

export const getMaintenanceCosts = async (params: { from?: string; to?: string; vehicle_id?: string }): Promise<MaintenanceCostReport> => {
  const response = await apiClient.get('/reports/maintenance-costs', { params });
  return response.data;
};

export const getFleetAvailability = async (): Promise<FleetAvailabilityReport> => {
  const response = await apiClient.get('/reports/fleet-availability');
  return response.data;
};

export const getBreakdowns = async (): Promise<BreakdownReport> => {
  const response = await apiClient.get('/reports/breakdowns');
  return response.data;
};

export const getTechnicianProductivity = async (): Promise<TechnicianProductivityReport> => {
  const response = await apiClient.get('/reports/technician-productivity');
  return response.data;
};

export const getUpcomingMaintenance = async (): Promise<UpcomingMaintenanceReport> => {
  const response = await apiClient.get('/reports/upcoming-maintenance');
  return response.data;
};

