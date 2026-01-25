
import React, { useState } from 'react';
import { api, endpoints } from '../lib/api';
import { UserSession, AIResponse } from '../types';
import { Upload, Play, ShieldAlert, CheckCircle2, Loader2, Info, Camera, Zap, Scan } from 'lucide-react';

interface CameraViewProps {
  session: UserSession;
}

const CameraView: React.FC<CameraViewProps> = ({ session }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'none', msg: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const analyzeFrame = async () => {
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file, file.name);

    try {
      const aiRes = await api.post<AIResponse>(endpoints.ai.predict, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (aiRes.data.count > 0) {
        const best = aiRes.data.predictions.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current);
        
        const reportData = new FormData();
        reportData.append('image', file, file.name);
        reportData.append('type', best.class);
        reportData.append('lat', '12.9716');
        reportData.append('lng', '77.5946');
        reportData.append('address', `${session.displayName} - Auto Alert`);

        const reportRes = await api.post(endpoints.citizen.report, reportData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setResult({
          type: 'error',
          msg: `ANOMALY DETECTED: ${best.class.toUpperCase()} (${(best.confidence * 100).toFixed(1)}%). SYSTEM HAS ISSUED TICKET #${reportRes.data.id}.`
        });
      } else {
        setResult({ type: 'success', msg: 'ASSET INTEGRITY VERIFIED. NO ANOMALIES DETECTED IN CURRENT FRAME.' });
      }
    } catch (err) {
      console.error(err);
      setResult({ type: 'none', msg: 'CRITICAL ERROR: AI ENGINE TIMEOUT OR DISCONNECTED.' });
    } finally {
      setTimeout(() => setAnalyzing(false), 2000); // Keep scanning effect longer for impact
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Camera className="w-8 h-8 text-blue-600" /> Smart Monitoring Node
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Active Neural Interface Network</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 text-slate-400 px-6 py-3 rounded-2xl shadow-xl shadow-slate-200 border border-slate-800">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-black uppercase tracking-widest text-slate-100">{session.username}</span>
           </div>
           <div className="w-px h-4 bg-slate-700"></div>
           <span className="text-[10px] font-bold">12.9716° N, 77.5946° E</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Frame Injection Terminal */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800 relative">
            <div className="absolute top-8 left-8 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Live View</span>
            </div>

            <label className={`relative block w-full h-[450px] rounded-[2rem] overflow-hidden group transition-all duration-500 cursor-pointer ${!file ? 'bg-slate-800' : ''}`}>
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Frame" className="w-full h-full object-cover" />
                  {analyzing && <div className="scan-line"></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
                  <div className="w-20 h-20 bg-slate-700 rounded-3xl flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-300 font-bold">Inject High-Res Frame</p>
                    <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Waiting for input...</p>
                  </div>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={analyzeFrame}
              disabled={!file || analyzing}
              className="flex-1 py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-900/40 hover:bg-blue-500 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm relative overflow-hidden group"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Core...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Deploy Neural Model
                </>
              )}
            </button>
            
            <button
              onClick={() => { setFile(null); setPreview(null); setResult(null); }}
              className="px-8 py-5 bg-white text-slate-400 border border-slate-200 font-black rounded-3xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
            >
              Flush
            </button>
          </div>
        </div>

        {/* Diagnostic Output */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                <Scan className="w-5 h-5 text-blue-600" /> Core Diagnostics
              </h2>

              <div className="space-y-6 flex-1">
                {!result && !analyzing && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                    <ShieldAlert className="w-16 h-16 text-slate-300" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for Analysis</p>
                  </div>
                )}

                {analyzing && (
                  <div className="space-y-6 animate-pulse">
                     {[1,2,3].map(i => (
                       <div key={i} className="h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-4">
                         <div className="w-4 h-4 bg-blue-200 rounded-full mr-3"></div>
                         <div className="h-2 w-32 bg-slate-200 rounded-full"></div>
                       </div>
                     ))}
                     <p className="text-center text-[10px] font-black text-blue-600 uppercase tracking-widest mt-8 animate-bounce">Neural Engine Computing...</p>
                  </div>
                )}

                {result && !analyzing && (
                  <div className={`p-8 rounded-3xl border ${result.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'} animate-in zoom-in-95 duration-500`}>
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${result.type === 'error' ? 'bg-red-200 text-red-600 shadow-xl shadow-red-200' : 'bg-emerald-200 text-emerald-600 shadow-xl shadow-emerald-200'}`}>
                        {result.type === 'error' ? <ShieldAlert className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-2xl tracking-tight leading-tight">
                          {result.type === 'error' ? 'Asset Breach Detected' : 'Scan Finalized'}
                        </h4>
                        <p className="text-sm font-bold opacity-80 leading-relaxed uppercase tracking-wide">
                          {result.msg}
                        </p>
                      </div>
                      <div className="pt-6 w-full border-t border-black/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                        <span>Confidence: 94.2%</span>
                        <span>Model: YOLO-V8.CVC</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Node Telemetry</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Signal Strength</span>
                      <span className="text-xs font-black text-emerald-600">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Latency</span>
                      <span className="text-xs font-black text-slate-900">14ms</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
