
import React from 'react';
import { UserSession } from '../types';
import { LogOut, User, Shield, Camera, Hammer, Activity, Menu } from 'lucide-react';

interface LayoutProps {
  session: UserSession;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ session, onLogout, children }) => {
  const getIcon = () => {
    switch (session.role) {
      case 'Admin': return <Shield className="w-5 h-5" />;
      case 'Worker': return <Hammer className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
    }
  };

  const getRoleBadge = () => {
    switch (session.role) {
      case 'Admin': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Worker': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Camera': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 flex flex-col hidden lg:flex border-r border-slate-800">
        <div className="p-8">
          <div className="flex items-center gap-3 font-bold text-2xl text-white">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20">
              <Activity className="w-6 h-6" />
            </div>
            <span className="tracking-tight">CivicResolve</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 mt-4">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Account Context</p>
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{session.displayName}</p>
                  <p className="text-slate-400 text-xs truncate">@{session.username.toLowerCase()}</p>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${getRoleBadge()}`}>
                {getIcon()}
                {session.role} Role
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Operations</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all group">
              <div className="p-1.5 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">Active Monitoring</span>
            </button>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Operator</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-40">
           <div className="flex items-center gap-2 lg:hidden">
              <Activity className="w-6 h-6 text-blue-600" />
              <span className="font-black text-slate-900 tracking-tight">CivicResolve</span>
           </div>
           
           <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">System Ready</span>
              <span>Central Node • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </div>

           <button className="lg:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
           </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
