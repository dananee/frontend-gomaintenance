
import React, { useState } from 'react';
import { Github, RefreshCw, Terminal, CheckCircle, AlertCircle, ExternalLink, GitBranch, GitCommit } from 'lucide-react';

export const Integrations: React.FC = () => {
  const [isCloning, setIsCloning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSynced, setIsSynced] = useState(false);
  const [repoUrl, setRepoUrl] = useState('https://github.com/gofleet-org/logistics-core');

  const simulateClone = () => {
    setIsCloning(true);
    setLogs(['Initializing git repository...', 'Connecting to GitHub...']);
    
    const steps = [
      'Fetching remote branches...',
      'Cloning logistics-core-v2.5.0...',
      'Resolving deltas (100%)...',
      'Checking out files...',
      'Optimizing route metadata...',
      'Syncing with GoFleet Cloud...',
      'Done!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsCloning(false);
          setIsSynced(true);
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">System Integrations</h2>
        <p className="text-slate-500">Manage external code sources and logistic logic repositories</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 flex items-start gap-6">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
            <Github size={32} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900">GitHub Code Sync</h3>
              <span className={`flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 rounded-full ${
                isSynced ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {isSynced ? <CheckCircle size={12} /> : null}
                {isSynced ? 'Synced' : 'Not Connected'}
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Clone your fleet's custom logistics algorithms, route configuration files, and driver policy scripts directly from a GitHub repository. Automated CI/CD for your physical fleet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="https://github.com/org/repo"
                />
              </div>
              <button 
                onClick={simulateClone}
                disabled={isCloning}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isCloning 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-black'
                }`}
              >
                {isCloning ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {isSynced ? 'Sync Again' : 'Clone from GitHub'}
              </button>
            </div>
          </div>
        </div>

        {/* Console / Terminal View */}
        {(logs.length > 0 || isCloning) && (
          <div className="bg-slate-900 p-6 font-mono text-sm border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 mb-4 border-b border-slate-800 pb-2">
              <Terminal size={14} />
              <span>GoFleet Git Console</span>
            </div>
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span className={log.includes('Done') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {log.includes('Done') ? '✓ ' : '$ '}{log}
                  </span>
                </div>
              ))}
              {isCloning && (
                <div className="flex gap-3 animate-pulse">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span className="text-blue-400">$ Processing...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GitBranch size={18} className="text-blue-500" />
            Active Deployment
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Branch</span>
              <span className="text-sm font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">main</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Last Commit</span>
              <span className="text-sm font-mono text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                7f2b9ac <ExternalLink size={12} />
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Synced On</span>
              <span className="text-sm text-slate-800 font-medium">{isSynced ? 'Just now' : 'Never'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-orange-500" />
            Sync Policies
          </h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Auto-Sync</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Deploy on Push to Main</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Pre-check Safety</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Run AI Validation on Scripts</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
