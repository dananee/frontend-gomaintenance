
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { KPI_CONFIG, INITIAL_ALERTS } from '../constants';
import { AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

const mockChartData = [
  { name: 'Mon', fuel: 400, distance: 2400 },
  { name: 'Tue', fuel: 300, distance: 1398 },
  { name: 'Wed', fuel: 200, distance: 9800 },
  { name: 'Thu', fuel: 278, distance: 3908 },
  { name: 'Fri', fuel: 189, distance: 4800 },
  { name: 'Sat', fuel: 239, distance: 3800 },
  { name: 'Sun', fuel: 349, distance: 4300 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Operational Overview</h2>
          <p className="text-slate-500">Real-time status of your logistics network</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
          <button className="px-3 py-1 bg-slate-100 rounded text-sm font-medium">Daily</button>
          <button className="px-3 py-1 text-sm font-medium text-slate-500">Weekly</button>
          <button className="px-3 py-1 text-sm font-medium text-slate-500">Monthly</button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_CONFIG.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                {kpi.icon}
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={14} />
                +2.5%
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{kpi.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-2">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Fleet Utilization
            </h3>
            <select className="text-sm bg-slate-50 border rounded px-2 py-1 outline-none">
              <option>By Distance (Mi)</option>
              <option>By Fuel (Gal)</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="distance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDistance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" />
            Active Alerts
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {INITIAL_ALERTS.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    alert.type === 'Critical' ? 'bg-red-100 text-red-600' : 
                    alert.type === 'Warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-xs text-slate-400">{alert.time}</span>
                </div>
                <p className="text-sm text-slate-700 font-medium">{alert.message}</p>
                <button className="text-xs text-blue-600 mt-2 hover:underline">View Details</button>
              </div>
            ))}
          </div>
          <button className="w-full py-3 mt-4 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
