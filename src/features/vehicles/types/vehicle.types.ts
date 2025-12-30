export type VehicleStatus = "active" | "maintenance" | "inactive";

export interface VehicleSummaryKPIs {
  total_maintenance_cost: number;
  total_downtime_hours: number;
  days_until_service: number | null;
  health_score: number;
  work_order_count: number;
}


export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  vin: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  current_km?: number;
  current_engine_hours?: number;
  created_at?: string;
  updated_at?: string;
  kpis?: VehicleSummaryKPIs;
  drivers?: Driver[];
}

export interface CreateVehicleDTO {
  plate_number: string;
  vin: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  drivers?: string[]; // IDs of assigned drivers
}

export interface UpdateVehicleDTO extends Partial<CreateVehicleDTO> {
  id: string;
}

