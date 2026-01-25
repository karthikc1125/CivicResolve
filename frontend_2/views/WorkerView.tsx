
import React, { useState, useEffect } from 'react';
import { api, endpoints, IMG_BASE_URL } from '../lib/api';
import { UserSession, IncidentReport } from '../types';
import { Hammer, MapPin, Image as ImageIcon, CheckCircle, RefreshCcw, Loader2, ClipboardCheck, ArrowUpCircle } from 'lucide-react';

interface WorkerViewProps {
  session: UserSession;
}

const WorkerView: React.FC<WorkerViewProps> = ({ session }) => {
  const [tasks, setTasks] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [proofs, setProofs] = useState<Record<number, File>>({});
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.workflow.workerTasks(session.username));
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleProofChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofs({ ...proofs, [id]: file });
      setPreviews({ ...previews, [id]: URL.createObjectURL(file) });
    }
  };

  const completeTask = async (task: IncidentReport) => {
    const proof = proofs[task.id];
    if (!proof) return;

    setSubmitting(task.id);
    const formData = new FormData();
    formData.append('image', proof, proof.name);
    formData.append('id', task.id.toString());
    formData.append('type', task.type);

    try {
      await api.post(endpoints.workflow.complete, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assigned Tasks</h1>
          <p className="text-slate-500 font-medium text-sm">Operator: {session.displayName}</p>
        </div>
        <button
          onClick={fetchTasks}
          disabled={loading}
          className="w-14 h-14 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center text-blue-600 disabled:opacity-50"
        >
          <RefreshCcw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 px-6">
           <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <ClipboardCheck className="w-10 h-10" />
           </div>
           <p className="text-slate-900 font-black text-2xl tracking-tight mb-2">Shift Complete!</p>
           <p className="text-slate-400 font-medium">All assigned assets are verified and functional. Return to base or standby for new tasks.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
               {/* Task Header */}
               <div className="p-8 bg-slate-900 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40">
                        <Hammer className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order #{task.id}</span>
                    </div>
                    <span className="px-3 py-1 bg-amber-400 text-slate-900 text-[10px] font-black uppercase rounded-full tracking-widest">Active</span>
                  </div>
                  <h4 className="font-black text-3xl tracking-tight uppercase leading-none">{task.type}</h4>
                  <div className="flex items-center gap-1.5 mt-4 text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold truncate">{task.location.address}</span>
                  </div>
               </div>

               {/* Task Body */}
               <div className="p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                      Asset Reference
                    </label>
                    <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-100 relative shadow-inner">
                      <img src={`${IMG_BASE_URL}/${task.images.original}`} alt="Issue" className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">Reported Frame</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                      Resolution Capture
                    </label>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <label className="relative flex items-center justify-center w-full h-48 border-4 border-dashed border-slate-100 rounded-[2.5rem] cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden">
                        {previews[task.id] ? (
                          <div className="absolute inset-0 w-full h-full">
                            <img src={previews[task.id]} alt="Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <RefreshCcw className="w-8 h-8 text-white animate-spin-slow" />
                            </div>
                          </div>
                        ) : (
                          <div className="text-center group-hover:scale-105 transition-transform">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <ImageIcon className="w-8 h-8 text-slate-300 transition-colors" />
                            </div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tap to capture proof</p>
                          </div>
                        )}
                        <input type="file" className="hidden" onChange={(e) => handleProofChange(task.id, e)} accept="image/*" />
                      </label>

                      <button
                        onClick={() => completeTask(task)}
                        disabled={submitting === task.id || !proofs[task.id]}
                        className="w-full py-6 bg-emerald-600 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-200/50 hover:bg-emerald-500 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-3 uppercase text-sm tracking-[0.2em]"
                      >
                        {submitting === task.id ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            <ArrowUpCircle className="w-6 h-6" />
                            Submit for Verification
                          </>
                        )}
                      </button>
                    </div>
                  </div>
               </div>
               
               <div className="px-8 pb-8 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-auto">End of Order</span>
               </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="pb-12 pt-4 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
          CivicResolve Field Protocol v4.0<br/>
          Secure Encrypted Field Channel
        </p>
      </div>
    </div>
  );
};

export default WorkerView;
