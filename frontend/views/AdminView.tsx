"use client";

import React, { useState, useEffect } from 'react';
import { api, endpoints, IMG_BASE_URL } from '../lib/api';
import { IncidentReport } from '../types';
import { RefreshCw, LayoutDashboard, CheckSquare, AlertCircle, CheckCircle2, List, Send, Map as MapIcon, ChevronRight, Activity } from 'lucide-react';

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verification'>('dashboard');
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignForm, setAssignForm] = useState({ incidentId: '', workerId: 'worker_01' });
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);

  // Safely load the map only on the client side
  useEffect(() => {
    let isMounted = true;
    import('../components/IncidentMap')
      .then((mod) => {
        if (isMounted) {
          // Use a functional update to store the component function without invoking it
          setMapComponent(() => mod.default);
        }
      })
      .catch((err) => {
        console.error("Critical: Map loading failed", err);
      });
    return () => { isMounted = false; };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.admin.reports);
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.incidentId) return;

    const incident = incidents.find(i => i.id === Number(assignForm.incidentId));
    if (!incident) return;

    try {
      await api.post(endpoints.workflow.assign, {
        id: incident.id,
        type: incident.type,
        worker_id: assignForm.workerId
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (id: number, type: string, decision: 'approve' | 'reject') => {
    try {
      await api.post(endpoints.workflow.verify, { id, type, decision });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = incidents.filter(i => i.status === 'pending').length;
  const resolvedCount = incidents.filter(i => i.status === 'verified').length;
  const verificationQueue = incidents.filter(i => i.status === 'completed');

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 font-medium mt-1">Global infrastructure state and maintenance control</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all font-bold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            Refresh Engine
          </button>
        </div>
      </div>

      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-lg shadow-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Analytics & Dispatch
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 relative ${activeTab === 'verification' ? 'bg-white text-blue-600 shadow-lg shadow-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <CheckSquare className="w-5 h-5" />
          Verification Gate
          {verificationQueue.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] font-black text-white items-center justify-center">
                {verificationQueue.length}
              </span>
            </span>
          )}
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bento-card bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
               <div className="flex items-center justify-between mb-2">
                 <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl">
                    <AlertCircle className="w-6 h-6" />
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-300" />
               </div>
               <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{pendingCount}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Alerts</p>
               </div>
            </div>
            <div className="bento-card bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
               <div className="flex items-center justify-between mb-2">
                 <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-300" />
               </div>
               <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{resolvedCount}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved Assets</p>
               </div>
            </div>
            <div className="bento-card bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
               <div className="flex items-center justify-between mb-2">
                 <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                    <List className="w-6 h-6" />
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-300" />
               </div>
               <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{incidents.length}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Lifecycle</p>
               </div>
            </div>
            <div className="bento-card bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[140px]">
               <div className="flex items-center justify-between mb-2">
                 <div className="p-2.5 bg-white/10 text-white rounded-2xl">
                    <Activity className="w-6 h-6" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded-full">Optimal</span>
               </div>
               <div>
                  <p className="text-2xl font-black text-white tracking-tight">98.4%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Health</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-slate-200 h-[500px] relative overflow-hidden">
              <div className="absolute top-6 left-6 z-[10] bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">Infrastructure Overlay</span>
              </div>
              {MapComponent ? (
                <MapComponent incidents={incidents} />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Map Engine...</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Real-time Feed</h3>
                  <button className="text-blue-600 text-xs font-bold hover:underline">Download Report</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50">
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {incidents.slice(0, 8).map((i) => (
                       <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4">
                           <p className="font-bold text-slate-800">#{i.id}</p>
                           <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{i.location.address}</p>
                         </td>
                         <td className="px-6 py-4">
                           <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">
                             {i.type}
                           </span>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${i.status === 'pending' ? 'bg-amber-500' : i.status === 'completed' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                             <span className="text-xs font-bold text-slate-600 capitalize">{i.status}</span>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-xs font-bold text-slate-500 italic">
                           {i.assigned_to || 'Awaiting Dispatch'}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl sticky top-24">
              <h3 className="text-xl font-black mb-2 tracking-tight">Rapid Response</h3>
              <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Assign personnel to active infrastructure alerts in the field.</p>
              
              <form onSubmit={handleAssign} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Alert ID</label>
                  <select
                    value={assignForm.incidentId}
                    onChange={(e) => setAssignForm({ ...assignForm, incidentId: e.target.value })}
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-white transition-all"
                    required
                  >
                    <option value="">Select ID...</option>
                    {incidents.filter(i => i.status === 'pending').map(i => (
                      <option key={i.id} value={i.id}>#{i.id} - {i.type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Field Operator</label>
                  <input
                    type="text"
                    value={assignForm.workerId}
                    onChange={(e) => setAssignForm({ ...assignForm, workerId: e.target.value })}
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-white transition-all"
                    placeholder="Worker ID"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2 group"
                >
                  <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  Dispatch Unit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {verificationQueue.length === 0 ? (
            <div className="md:col-span-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <CheckSquare className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-black text-xl tracking-tight">All assets verified.</p>
              <p className="text-slate-400 font-medium">No tasks are currently waiting for human approval.</p>
            </div>
          ) : (
            verificationQueue.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-0.5">
                    <h4 className="font-black text-slate-900 text-xl tracking-tight leading-none">Review Fix #{t.id}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.location.address}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-200">
                    {t.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Issue Report</p>
                    <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 relative group">
                      <img src={`${IMG_BASE_URL}/${t.images.original}`} alt="Original" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply opacity-50"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Field Proof</p>
                    <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 relative group">
                      <img src={`${IMG_BASE_URL}/${t.images.resolved}`} alt="Resolved" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply opacity-50"></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleVerify(t.id, t.type, 'approve')}
                    className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 uppercase text-[10px] tracking-widest"
                  >
                    Commit Fix
                  </button>
                  <button
                    onClick={() => handleVerify(t.id, t.type, 'reject')}
                    className="flex-1 py-4 bg-white text-slate-400 border border-slate-200 font-black rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all uppercase text-[10px] tracking-widest"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminView;