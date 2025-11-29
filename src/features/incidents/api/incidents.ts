import { axios } from '@/lib/axios';

export interface Incident {
  id: string;
  title: string;
  description: string;
  vehicle_id: string;
  driver_id?: string;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  vehicle_id: string;
  driver_id?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  occurred_at: string;
}

export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
  status?: 'reported' | 'investigating' | 'resolved' | 'closed';
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const getIncidents = async (): Promise<Incident[]> => {
  const response = await axios.get('/incidents');
  return response.data;
};

export const getIncident = async (id: string): Promise<Incident> => {
  const response = await axios.get(`/incidents/${id}`);
  return response.data;
};

export const createIncident = async (data: CreateIncidentRequest): Promise<Incident> => {
  const response = await axios.post('/incidents', data);
  return response.data;
};

export const updateIncident = async (id: string, data: UpdateIncidentRequest): Promise<Incident> => {
  const response = await axios.put(`/incidents/${id}`, data);
  return response.data;
};

export const deleteIncident = async (id: string): Promise<void> => {
  await axios.delete(`/incidents/${id}`);
};
