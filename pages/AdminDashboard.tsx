import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { authService } from '../services/auth';
import { AccessCode, Review, AggregatedMetrics } from '../types';
import { Smartphone, FileText, ExternalLink, Trash2, RefreshCw, Settings, Lock, LogOut, ShieldCheck, Download, Zap } from 'lucide-react';
import InviteManager from '../components/admin/InviteManager';
import AnalyticsManager from '../components/admin/AnalyticsManager';
import SettingsManager from '../components/admin/SettingsManager';
import { useToast } from '../components/ui/ToastProvider';

type ActiveTab = 'invites' | 'reviews' | 'settings';

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as ActiveTab | null;
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>(tabParam || 'invites');
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);

  const refreshData = useCallback(() => {
    try {
      setCodes([...db.getCodes()].reverse());
      setReviews([...db.getReviews()].reverse());
      setMetrics(db.getMetrics());
    } catch (e) {
      console.error("Failed to load data", e);
    }
  }, []);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthorized(true);
      refreshData();
    }
  }, [refreshData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authService.login(loginPassword)) {
      setIsAuthorized(true);
      refreshData();
      showToast('Welcome back, Admin.', 'success');
    } else {
      showToast('Invalid access credentials.', 'error');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthorized(false);
    navigate('/');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleReset = () => {
    if (window.confirm("CRITICAL ACTION: This will erase all customer reviews and invite codes. Are you absolutely sure?")) {
      db.reset();
      refreshData();
      showToast('Database wiped successfully.', 'info');
    }
  };

  const handleExport = () => {
    const data = { codes: db.getCodes(), reviews: db.getReviews() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer_success_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Backup file generated.', 'success');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0B0415] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0B0415] to-[#0B0415]">
        <div className="max-w-md w-full bg-[#1A1025]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 p-10 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Lock className="text-cyan-400" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Admin Gateway</h2>
          <p className="text-slate-400 mb-8 font-medium text-sm">Authentication Required</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-[#0B0415] border border-white/10 rounded-2xl p-4 text-center text-xl text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-700"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all shadow-xl active:scale-[0.98] uppercase tracking-wide"
            >
              Unlock Dashboard
            </button>
          </form>
          <button onClick={() => navigate('/')} className="mt-8 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
            Back to Public View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0415] flex flex-col lg:flex-row text-white selection:bg-purple-500/30">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#1A1025]/60 backdrop-blur-md border-r border-white/5 flex flex-col flex-shrink-0 z-40">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-xl shadow-lg"><Zap className="text-white" size={20} fill="#FFD700" /></div>
            <h1 className="text-lg font-black text-white tracking-wide uppercase">Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">System Operational</p>
          </div>
        </div>
        
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible px-4 pb-4 lg:pb-0 gap-2 flex-grow">
          <button onClick={() => handleTabChange('invites')} className={`group flex-1 lg:flex-none text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === 'invites' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Smartphone size={20} className={activeTab === 'invites' ? 'text-black' : 'group-hover:text-cyan-400'} />
            <span className="font-bold text-sm uppercase tracking-wide">Invites</span>
          </button>
          <button onClick={() => handleTabChange('reviews')} className={`group flex-1 lg:flex-none text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === 'reviews' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <FileText size={20} className={activeTab === 'reviews' ? 'text-black' : 'group-hover:text-cyan-400'} />
            <span className="font-bold text-sm uppercase tracking-wide">Analytics</span>
          </button>
          <button onClick={() => handleTabChange('settings')} className={`group flex-1 lg:flex-none text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === 'settings' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Settings size={20} className={activeTab === 'settings' ? 'text-black' : 'group-hover:text-cyan-400'} />
            <span className="font-bold text-sm uppercase tracking-wide">Config</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-white/5 space-y-1">
          <button onClick={handleExport} className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 uppercase tracking-wider">
            <Download size={14} /> Export Data
          </button>
          <button onClick={handleReset} className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3 uppercase tracking-wider">
            <Trash2 size={14} /> Wipe Database
          </button>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 mt-4 uppercase tracking-wider">
            <LogOut size={14} /> End Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0B0415]">
        {/* Header Bar */}
        <div className="bg-[#0f0518]/80 backdrop-blur-md h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            {{
              invites: 'Management Hub',
              reviews: 'Performance Insights',
              settings: 'Global Config',
            }[activeTab]}
          </h2>
          <div className="flex items-center gap-4">
            <a href="#/" target="_blank" className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-white transition-colors uppercase tracking-widest">
              <ExternalLink size={14} /> Open Public Site
            </a>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <button onClick={refreshData} className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto pb-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'invites' && <InviteManager codes={codes} onDataChange={refreshData} />}
            {activeTab === 'reviews' && <AnalyticsManager reviews={reviews} metrics={metrics} />}
            {activeTab === 'settings' && <SettingsManager />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;