
import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Search, Filter } from 'lucide-react';
import { INITIAL_VEHICLES } from '../constants';
import { Vehicle } from '../types';

export const LiveMap: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Simple animation for simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status !== 'Active') return v;
        const speed = 0.0005;
        const drift = (Math.random() - 0.5) * 0.0002;
        return {
          ...v,
          lat: v.lat + speed + drift,
          lng: v.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.floor(Math.random() * 10) + 55
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search vehicle ID or driver..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors">
            <Filter size={18} />
            Filter Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Navigation size={18} />
            Recenter View
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-800 rounded-2xl relative overflow-hidden shadow-inner border border-slate-700">
        {/* SVG Grid/Map Placeholder */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Map UI Elements */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border shadow-xl w-64">
            <h4 className="font-bold text-slate-800 mb-3">Live Fleet Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Active</span>
                <span className="font-bold text-blue-600">3 Vehicles</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Average Speed</span>
                <span className="font-bold text-emerald-600">58 MPH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">On Schedule</span>
                <span className="font-bold text-slate-800">92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Vehicles on Map */}
        <div className="relative w-full h-full flex items-center justify-center">
          {vehicles.map((v, idx) => (
            <div 
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`absolute cursor-pointer group transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2`}
              style={{
                left: `${30 + (idx * 12)}%`,
                top: `${40 + (Math.sin(idx) * 20)}%`
              }}
            >
              <div className="relative">
                {v.status === 'Active' && (
                  <div className="absolute inset-0 animate-ping bg-blue-500/30 rounded-full"></div>
                )}
                <div className={`p-2 rounded-lg border-2 shadow-lg transition-transform group-hover:scale-110 ${
                  v.status === 'Active' ? 'bg-blue-600 border-blue-400' : 
                  v.status === 'Idle' ? 'bg-orange-600 border-orange-400' : 
                  v.status === 'Maintenance' ? 'bg-slate-700 border-slate-500' : 'bg-red-600 border-red-400'
                }`}>
                  <Truck size={20} className="text-white" />
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {v.id} • {v.speed} mph
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle Detail Drawer */}
        {selectedVehicle && (
          <div className="absolute bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <h4 className="font-bold text-slate-800">{selectedVehicle.id} Details</h4>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {selectedVehicle.driver.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedVehicle.driver}</p>
                  <p className="text-xs text-slate-500">Fleet Driver ID: DRV-00{selectedVehicle.id.split('-')[1]}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Fuel</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${selectedVehicle.fuel < 20 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${selectedVehicle.fuel}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold">{selectedVehicle.fuel}%</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Speed</p>
                  <p className="text-sm font-bold mt-1 text-slate-800">{selectedVehicle.speed} MPH</p>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  Contact Driver
                </button>
                <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                  View Full Route History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
