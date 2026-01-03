
import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Truck, 
  BarChart3, 
  Bot, 
  AlertCircle,
  Fuel,
  Navigation,
  CheckCircle2,
  Github
} from 'lucide-react';
import { Vehicle, FleetAlert, PerformanceStats } from './types';

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'FL-101', name: 'Freightliner M2', status: 'Active', fuel: 78, lat: 40.7128, lng: -74.0060, lastUpdate: '2 mins ago', driver: 'John Smith', speed: 65 },
  { id: 'FL-202', name: 'Volvo VNL 860', status: 'Active', fuel: 45, lat: 34.0522, lng: -118.2437, lastUpdate: 'Just now', driver: 'Sarah Jones', speed: 55 },
  { id: 'FL-303', name: 'Kenworth T680', status: 'Idle', fuel: 12, lat: 41.8781, lng: -87.6298, lastUpdate: '15 mins ago', driver: 'Mike Ross', speed: 0 },
  { id: 'FL-404', name: 'Peterbilt 579', status: 'Maintenance', fuel: 92, lat: 29.7604, lng: -95.3698, lastUpdate: '1 hour ago', driver: 'None', speed: 0 },
  { id: 'FL-505', name: 'Mack Anthem', status: 'Active', fuel: 60, lat: 33.7490, lng: -84.3880, lastUpdate: '5 mins ago', driver: 'Elena G.', speed: 62 },
];

export const INITIAL_ALERTS: FleetAlert[] = [
  { id: 'A1', type: 'Critical', message: 'Low fuel warning for FL-303', time: '10 mins ago', vehicleId: 'FL-303' },
  { id: 'A2', type: 'Warning', message: 'Hard braking detected - FL-101', time: '25 mins ago', vehicleId: 'FL-101' },
  { id: 'A3', type: 'Info', message: 'FL-404 maintenance scheduled for 2 PM', time: '1 hour ago', vehicleId: 'FL-404' },
];

export const INITIAL_STATS: PerformanceStats = {
  totalDistance: 12450,
  avgFuelEfficiency: 6.8,
  activeVehicles: 3,
  deliveriesCompleted: 42,
};

export const MENU_ITEMS = [
  { id: 'Dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'LiveMap', label: 'Live Tracking', icon: <MapIcon size={20} /> },
  { id: 'FleetList', label: 'Vehicle List', icon: <Truck size={20} /> },
  { id: 'Analytics', label: 'Reports', icon: <BarChart3 size={20} /> },
  { id: 'AIConsultant', label: 'AI Dispatcher', icon: <Bot size={20} /> },
  { id: 'Integrations', label: 'GitHub Sync', icon: <Github size={20} /> },
] as const;

export const KPI_CONFIG = [
  { label: 'Active Fleet', value: '3/5', icon: <Truck className="text-blue-500" />, trend: '+2% from last week' },
  { label: 'Fuel Usage', value: '452 Gal', icon: <Fuel className="text-orange-500" />, trend: '-5% vs target' },
  { label: 'Total Distance', value: '12.4k Mi', icon: <Navigation className="text-emerald-500" />, trend: '+12% this month' },
  { label: 'Completion Rate', value: '98.2%', icon: <CheckCircle2 className="text-purple-500" />, trend: 'Target: 95%' },
];
