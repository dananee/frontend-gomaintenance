
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LiveMap } from './components/Map';
import { FleetChat } from './components/FleetChat';
import { Integrations } from './components/Integrations';
import { ViewType } from './types';
import { Bell, Search, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('Dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'LiveMap':
        return <LiveMap />;
      case 'AIConsultant':
        return <FleetChat />;
      case 'Integrations':
        return <Integrations />;
      case 'FleetList':
        return (
          <div className="bg-white p-8 rounded-2xl border text-center text-slate-500">
            <p className="text-lg font-medium">Detailed Fleet Inventory view is under development.</p>
            <p className="text-sm">Use Live Tracking to view current status.</p>
          </div>
        );
      case 'Analytics':
        return (
          <div className="bg-white p-8 rounded-2xl border text-center text-slate-500">
            <p className="text-lg font-medium">Advanced Performance Analytics is under development.</p>
            <p className="text-sm">Check the Overview Dashboard for summary metrics.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} setView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col transition-all">
        {/* Top Navbar */}
        <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Quick search across fleet..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin Console</p>
                <p className="text-xs text-slate-500">Fleet Manager</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer">
                <User size={20} />
              </div>
            </div>
          </div>
        </nav>

        {/* View Container */}
        <div className="p-8 max-w-7xl mx-auto flex-1">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 text-center text-slate-400 text-xs mt-auto">
          <p>&copy; 2025 GoFleet Systems. Intelligent Logistics and Operations Control.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
