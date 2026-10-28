import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CloudSun, 
  Share2, 
  CheckCircle2, 
  Server, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

function App() {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkApiHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setApiStatus({ success: true, ...data });
    } catch (err) {
      setApiStatus({ success: false, error: err.message });
    } finally {
      setLoading(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const milestones = [
    { day: 'Day 1', title: 'MERN & Tailwind v4 Scaffolding', status: 'Completed', icon: Server, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { day: 'Day 2', title: 'JWT Authentication & Security', status: 'Next', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { day: 'Day 3', title: 'Client Auth Context & Navigation', status: 'Planned', icon: Compass, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { day: 'Day 4', title: 'Trip Model & CRUD Dashboard', status: 'Planned', icon: Calendar, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { day: 'Day 5', title: 'Places & Location Logging', status: 'Planned', icon: MapPin, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { day: 'Day 6', title: 'Cloudinary Photo Uploads', status: 'Planned', icon: Sparkles, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { day: 'Day 7', title: 'Expense Aggregation & Analytics', status: 'Planned', icon: DollarSign, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { day: 'Day 8', title: 'Chronological Timeline & Weather', status: 'Planned', icon: CloudSun, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { day: 'Day 9', title: 'Cryptographic Public Share', status: 'Planned', icon: Share2, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">TravelLog</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                v1.0.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Day 1 Milestone Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-medium text-indigo-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              MSc Computing — B9IS130 Web Development CA1
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
              Hello World, from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-amber-200">
                TravelLog Architecture
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              Integrated travel journaling, Cloudinary photo preservation, day-by-day vertical timelines, and multi-currency expense ledger.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 font-medium">
                MongoDB Atlas
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 font-medium">
                Express 5 (ES Modules)
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 font-medium">
                React 19 + Vite
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 font-medium">
                Tailwind CSS v4
              </span>
            </div>
          </div>
        </div>

        {/* Live Proxy & Health Check Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                Vite Client ↔ Express Backend Handshake Check
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Verifies reverse-proxy communication through Vite dev server (`/api/health` → `localhost:5000`)
              </p>
            </div>

            <button
              onClick={checkApiHealth}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Test API Connection
            </button>
          </div>

          <div className="pt-6">
            {apiStatus ? (
              apiStatus.success ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Server Responding: {apiStatus.service}</div>
                      <div className="text-xs text-emerald-700 mt-0.5">
                        Status: <span className="font-bold">200 OK</span> • Uptime: {apiStatus.uptime} • Environment: {apiStatus.environment}
                      </div>
                    </div>
                  </div>
                  {lastChecked && (
                    <span className="text-xs text-emerald-600 bg-white/70 px-2.5 py-1 rounded-md border border-emerald-200">
                      Pinged at {lastChecked}
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5"></div>
                  <div>
                    <div className="font-semibold text-sm">Backend Standby / Not Running</div>
                    <div className="text-xs text-amber-700 mt-0.5">
                      Could not reach `/api/health`. Start the server with `npm run dev` in the `server` folder. (Error: {apiStatus.error})
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-sm text-slate-400 italic">Checking backend connectivity...</div>
            )}
          </div>
        </div>

        {/* 10-Day Implementation Sprint Roadmap */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Sprint Milestone Roadmap</h3>
            <span className="text-xs text-slate-500 font-medium">Specification Aligned</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div 
                  key={m.day} 
                  className={`p-5 rounded-2xl border transition-all ${
                    m.status === 'Completed' 
                      ? 'bg-white border-emerald-200 shadow-sm ring-1 ring-emerald-100' 
                      : m.status === 'Next'
                      ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-100'
                      : 'bg-white/60 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{m.day}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${m.color}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">{m.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            TravelLog Academic Project — Dublin Business School (CA1 Level 9)
          </div>
          <div className="flex items-center gap-6">
            <span>Module Leader: Dr. Obinna Izima</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>Target: High Distinction (70%+)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
