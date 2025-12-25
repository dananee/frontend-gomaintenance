// Types for vehicle driver assignment

export interface DriverInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export interface VehicleDriver {
  id: string;
  vehicle_id: string;
  driver_id: string;
  driver: DriverInfo;
  start_date?: string;
  end_date?: string;
  is_primary: boolean;
  created_at: string;
}

export interface AssignDriversRequest {
  driver_ids: string[];
  primary_driver_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateDriverAssignmentRequest {
  start_date?: string;
  end_date?: string;
  is_primary?: boolean;
}
