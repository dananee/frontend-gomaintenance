export type EnergyType = "PETROL" | "ELECTRIC";

export type MotorcycleStatus = "active" | "maintenance" | "inactive";

/**
 * DTO for creating a new motorcycle
 * Simplified compared to CreateVehicleDTO - only essential fields
 */
export interface CreateMotorcycleDTO {
  plate_number: string;
  brand: string;
  model: string;
  energy_type: EnergyType;
  status: MotorcycleStatus;
}

/**
 * DTO for updating an existing motorcycle
 */
export interface UpdateMotorcycleDTO extends Partial<CreateMotorcycleDTO> {
  id: string;
}

/**
 * Complete motorcycle object as returned from API
 */
export interface Motorcycle extends CreateMotorcycleDTO {
  id: string;
  type: "MOTORCYCLE";
  vehicle_type_id: string;
  maintenance_plan_id: null;
  current_km: number;
  vin?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}
