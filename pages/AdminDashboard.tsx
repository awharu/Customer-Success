import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { authService } from '../services/auth';
import { AccessCode, Review, AggregatedMetrics } from '../types';
import { Smartphone, FileText, ExternalLink, Trash2, RefreshCw, Settings, Lock, LogOut, ShieldCheck, Download, Upload } from 'lucide-react';
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
    if (window.confirm("CRITICAL ACTION: This will erase all patient reviews and invite codes. Are you absolutely sure?")) {
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
    link.download = `pharma_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Backup file generated.', 'success');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-teal-100">
            <Lock className="text-teal-600" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Admin Gateway</h2>
          <p className="text-slate-500 mb-8 font-medium">Please enter your management key (hint: 'admin').</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center text-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:outline-none transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
            >
              Unlock Dashboard
            </button>
          </form>
          <button onClick={() => navigate('/')} className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
            Back to Public View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-40">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-600 p-2 rounded-xl"><ShieldCheck className="text-white" size={24}/></div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Admin Console</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">System Operational</p>
          </div>
        </div>
        
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible px-4 pb-4 lg:pb-0 gap-2 flex-grow">
          <button onClick={() => handleTabChange('invites')} className={`group flex-1 lg:flex-none text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === 'invites' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <Smartphone size={20} className={activeTab === 'invites' ? 'text-teal-400' : 'group-hover:text-teal-600'} />
            <span className="font-bold text-sm">Delivery Invites</span>
          </button>
          <button onClick={() => handleTabChange('reviews')} className={`group flex-1 lg:flex-none text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === 'reviews' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <FileText size={20} className={activeTab === 'reviews' ? 'text-teal-400' : 'group-hover:text-teal-600'} />
            <span className="font-bold text-sm">Review Analytics</span>
          </button>
          <button onClick={() => handleTabChange('settings')} className={`group flex-1 lg:flex-none text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <Settings size={20} className={activeTab === 'settings' ? 'text-teal-400' : 'group-hover:text-teal-600'} />
            <span className="font-bold text-sm">Service Config</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-slate-100 space-y-1">
          <button onClick={handleExport} className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-3">
            <Download size={16} /> Export Data
          </button>
          <button onClick={handleReset} className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-50 transition-all flex items-center gap-3">
            <Trash2 size={16} /> Wipe Database
          </button>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-3 mt-4">
            <LogOut size={16} /> End Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Bar */}
        <div className="bg-white/80 backdrop-blur-md h-20 border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-xl font-black text-slate-800">
            {{
              invites: 'Management Hub',
              reviews: 'Performance Insights',
              settings: 'Global Config',
            }[activeTab]}
          </h2>
          <div className="flex items-center gap-4">
            <a href="#/" target="_blank" className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">
              <ExternalLink size={14} /> Open Public Site
            </a>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button onClick={refreshData} className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:shadow-md transition-all">
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