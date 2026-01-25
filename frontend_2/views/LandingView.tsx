import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, MapPin, Trash2, AlertTriangle, ArrowRight, CheckCircle2, Globe, Users } from 'lucide-react';
import { IncidentReport } from '../types';
import dynamic from 'next/dynamic';

const IncidentMap = dynamic(() => import('../components/IncidentMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Map Cluster...</div>
});

interface LandingViewProps {
  onEnterPortal: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onEnterPortal }) => {
  const [mockIncidents, setMockIncidents] = useState<IncidentReport[]>([]);

  useEffect(() => {
    // Generate Bhopal Mock Data
    const bhopalCenter = { lat: 23.2599, lng: 77.4126 };
    const mockData: IncidentReport[] = [
      {
        id: 1,
        type: 'Garbage Accumulation',
        status: 'pending',
        location: { lat: 23.2620, lng: 77.4150, address: 'M.P. Nagar Zone-1' },
        images: { original: 'mock1.jpg' }
      },
      {
        id: 2,
        type: 'Severe Pothole',
        status: 'completed',
        location: { lat: 23.2550, lng: 77.4080, address: 'Arera Colony Sector-3' },
        images: { original: 'mock2.jpg' }
      },
      {
        id: 3,
        type: 'Garbage Accumulation',
        status: 'verified',
        location: { lat: 23.2680, lng: 77.4200, address: 'Hamidia Road' },
        images: { original: 'mock3.jpg' }
      },
      {
        id: 4,
        type: 'Infrastructure Damage',
        status: 'pending',
        location: { lat: 23.2450, lng: 77.4000, address: 'Bittan Market Area' },
        images: { original: 'mock4.jpg' }
      }
    ];
    setMockIncidents(mockData);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">CivicResolve</span>
          </div>
          <button 
            onClick={onEnterPortal}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-sm flex items-center gap-2"
          >
            Operator Login
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8">
            <ShieldCheck className="w-4 h-4" />
            AI-Driven Infrastructure Integrity
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            The Smart Pulse of <br/>
            <span className="text-blue-600">Bhopal City</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg font-medium mb-12">
            Real-time anomaly detection, automated dispatching, and verified resolutions. Empowering civic authorities with neural city monitoring.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={onEnterPortal} className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center gap-3">
              Explore Live Data
              <Globe className="w-5 h-5" />
            </button>
            <div className="px-10 py-5 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-500" />
              12 Active Nodes
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="py-20 px-6 bg-slate-50/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-64">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                  <Trash2 className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">1,248</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Garbage Anomalies Processed</p>
              </div>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-64">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">402</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Potholes Repaired</p>
              </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 flex flex-col justify-between h-64 text-white">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-white/10 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tight">98.4%</h3>
                <p className="text-blue-200 font-bold uppercase text-[10px] tracking-widest">Resolution Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Live Detection Feed</h2>
              <p className="text-slate-500 font-medium mt-2">Current monitoring coverage across Bhopal Metro region.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              <MapPin className="w-4 h-4 text-red-500" />
              Center: Bhopal, MP
            </div>
          </div>

          <div className="bg-white p-2 rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden h-[600px] relative">
            <div className="absolute top-8 right-8 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Active Alert</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Verified Fix</span>
                </div>
              </div>
            </div>
            <IncidentMap incidents={mockIncidents} center={[23.2599, 77.4126]} zoom={13} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight">CivicResolve</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Advancing urban living through machine vision and automated civic workflows. Designed for the modern city.
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-6">Protocols</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">YOLO-V11 Integration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Field Agent API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Node Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-6">System</h4>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-slate-400 mb-2">V4.2.0-STABLE</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-black text-emerald-500">All Modules Nominal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} CivicResolve Technologies. Secured Environment.
        </div>
      </footer>
    </div>
  );
};

export default LandingView;