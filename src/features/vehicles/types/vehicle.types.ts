export type VehicleStatus = "active" | "maintenance" | "inactive";

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
}

export interface CreateVehicleDTO {
  plate_number: string;
  vin: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
}

export interface UpdateVehicleDTO extends Partial<CreateVehicleDTO> {
  id: string;
}
