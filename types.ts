
export interface Vehicle {
  id: string;
  name: string;
  status: 'Active' | 'Idle' | 'Maintenance' | 'Offline';
  fuel: number;
  lat: number;
  lng: number;
  lastUpdate: string;
  driver: string;
  speed: number;
}

export interface FleetAlert {
  id: string;
  type: 'Critical' | 'Warning' | 'Info';
  message: string;
  time: string;
  vehicleId?: string;
}

export interface PerformanceStats {
  totalDistance: number;
  avgFuelEfficiency: number;
  activeVehicles: number;
  deliveriesCompleted: number;
}

export type ViewType = 'Dashboard' | 'LiveMap' | 'FleetList' | 'Analytics' | 'AIConsultant' | 'Integrations';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
