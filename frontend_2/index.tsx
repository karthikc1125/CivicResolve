import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { UserSession } from './types';
import LoginView from './views/LoginView';
import Layout from './components/Layout';
import AdminView from './views/AdminView';
import WorkerView from './views/WorkerView';
import CameraView from './views/CameraView';

function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('civic_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('civic_session');
      }
    }
  }, []);

  const handleLogin = (user: UserSession) => {
    setSession(user);
    localStorage.setItem('civic_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('civic_session');
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  if (!session) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <Layout session={session} onLogout={handleLogout}>
      {session.role === 'Admin' && <AdminView />}
      {session.role === 'Worker' && <WorkerView session={session} />}
      {session.role === 'Camera' && <CameraView session={session} />}
    </Layout>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
