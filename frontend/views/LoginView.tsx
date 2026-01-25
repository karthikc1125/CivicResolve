
import React, { useState } from 'react';
import { UserSession } from '../types';
import { Shield, Key, Lock, Activity, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (session: UserSession) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate network delay for UX
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin({ username: 'admin', role: 'Admin', displayName: 'Administrator' });
      } else if (username === 'worker' && password === 'fixit') {
        onLogin({ username: 'worker_01', role: 'Worker', displayName: 'Maintenance Crew 01' });
      } else if (username === 'cam' && password === 'smartcity') {
        onLogin({ username: 'CAM_SECTOR_4', role: 'Camera', displayName: 'Sector 4 Camera' });
      } else {
        setError('Invalid credentials. Please verify your identity.');
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-6">
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Activity className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">CivicResolve</h1>
          <p className="text-blue-200/60 font-medium tracking-wide text-sm uppercase">Infrastructure Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 text-red-200 text-sm font-semibold rounded-2xl border border-red-500/20 flex items-center gap-3 animate-in slide-in-from-top-2">
              <Shield className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-200/50 uppercase ml-2 tracking-widest">Operator Identity</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/40 group-focus-within:text-blue-400 transition-colors">
                <Key className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white placeholder-white/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-200/50 uppercase ml-2 tracking-widest">Security Access Key</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/40 group-focus-within:text-blue-400 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white placeholder-white/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/40 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            {isSubmitting ? (
              <Activity className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Access Control Center
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center text-xs text-white/20 font-medium tracking-wider">
          SECURE PROTOCOL V4.2.0 • ENCRYPTED SESSION
        </div>
      </div>
    </div>
  );
};

export default LoginView;
