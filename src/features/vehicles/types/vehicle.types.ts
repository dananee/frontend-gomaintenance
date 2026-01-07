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

export interface VehicleType {
  id: string;
  tenant_id: string | null;
  code: string;
  name: string;
  icon: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  vin: string;
  type: string; // Deprecated
  vehicle_type_id: string;
  vehicle_type?: VehicleType;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  current_km?: number;
  current_engine_hours?: number;
  meter_unit?: "km" | "hours";
  fuel_type?: string;
  address?: string;
  ville_id?: number;
  ville?: { id: number; ville: string; region_id: number; region_data?: { id: number; region: string } };
  vehicle_condition?: string;
  created_at?: string;
  updated_at?: string;
  kpis?: VehicleSummaryKPIs;
  drivers?: Driver[];
}

export interface CreateVehicleDTO {
  plate_number: string;
  vin: string;
  vehicle_type_id: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  meter_unit?: "km" | "hours";
  drivers?: string[]; // IDs of assigned drivers
  ville_id?: number;
  address?: string;
}

export interface UpdateVehicleDTO extends Partial<CreateVehicleDTO> {
  id: string;
}

