import { axios } from '@/lib/axios';

export interface MaintenanceTemplate {
  id: string;
  name: string;
  description?: string;
  frequency_type: 'days' | 'engine_hours';
  frequency_value: number;
  tasks: any[]; // Define specific task type if available
  created_at: string;
  updated_at: string;
}

export interface CreateMaintenanceTemplateRequest {
  name: string;
  description?: string;
  frequency_type: 'days' | 'engine_hours';
  frequency_value: number;
  tasks?: any[];
}

export interface UpdateMaintenanceTemplateRequest {
  name?: string;
  description?: string;
  frequency_type?: 'days' | 'engine_hours';
  frequency_value?: number;
  tasks?: any[];
}

export interface MaintenancePlan {
  id: string;
  vehicle_id: string;
  template_id?: string;
  name: string;
  status: 'active' | 'inactive' | 'paused';
  next_due_date?: string;
  next_due_engine_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMaintenancePlanRequest {
  vehicle_id: string;
  template_id?: string;
  name: string;
  status?: 'active' | 'inactive' | 'paused';
}

export interface UpdateMaintenancePlanRequest {
  name?: string;
  status?: 'active' | 'inactive' | 'paused';
}

// Maintenance Templates
export const getMaintenanceTemplates = async (): Promise<MaintenanceTemplate[]> => {
  const response = await axios.get('/maintenance/templates');
  return response.data;
};

export const getMaintenanceTemplate = async (id: string): Promise<MaintenanceTemplate> => {
  const response = await axios.get(`/maintenance/templates/${id}`);
  return response.data;
};

export const createMaintenanceTemplate = async (data: CreateMaintenanceTemplateRequest): Promise<MaintenanceTemplate> => {
  const response = await axios.post('/maintenance/templates', data);
  return response.data;
};

export const updateMaintenanceTemplate = async (id: string, data: UpdateMaintenancePlanRequest): Promise<MaintenanceTemplate> => {
  const response = await axios.put(`/maintenance/templates/${id}`, data);
  return response.data;
};

export const deleteMaintenanceTemplate = async (id: string): Promise<void> => {
  await axios.delete(`/maintenance/templates/${id}`);
};

// Maintenance Plans (Vehicle specific usually, but general endpoints if available)
// Note: Backend routes show /vehicles/:id/maintenance-plans, so these might need to be in vehicle service or take vehicleId param
// But checking openapi, there isn't a top level /maintenance-plans endpoint, only under vehicles.
// Wait, I missed if there is a top level one. Let me re-check openapi.yaml in my head...
// The openapi.yaml had:
//   /vehicles/{id}/maintenance-plans
// It did NOT have a top level /maintenance-plans.
// So I should probably put maintenance plans in a vehicle-related service or here but requiring vehicleId.
// Let's put them here but clearly typed.

export const getMaintenancePlans = async (vehicleId: string): Promise<MaintenancePlan[]> => {
  const response = await axios.get(`/vehicles/${vehicleId}/maintenance-plans`);
  return response.data;
};

export const createMaintenancePlan = async (vehicleId: string, data: CreateMaintenancePlanRequest): Promise<MaintenancePlan> => {
  const response = await axios.post(`/vehicles/${vehicleId}/maintenance-plans`, data);
  return response.data;
};

export const updateMaintenancePlan = async (vehicleId: string, planId: string, data: UpdateMaintenancePlanRequest): Promise<MaintenancePlan> => {
  const response = await axios.put(`/vehicles/${vehicleId}/maintenance-plans/${planId}`, data);
  return response.data;
};

export const deleteMaintenancePlan = async (vehicleId: string, planId: string): Promise<void> => {
  await axios.delete(`/vehicles/${vehicleId}/maintenance-plans/${planId}`);
};
