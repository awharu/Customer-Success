import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../services/db';
import { AccessCode, Review } from '../types';
import { Smartphone, FileText, ExternalLink, Trash2, RefreshCw, Settings } from 'lucide-react';
import InviteManager from '../components/admin/InviteManager';
import AnalyticsManager from '../components/admin/AnalyticsManager';
import SettingsManager from '../components/admin/SettingsManager';

type ActiveTab = 'invites' | 'reviews' | 'settings';

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as ActiveTab | null;
  
  const [activeTab, setActiveTab] = useState<ActiveTab>(tabParam || 'invites');
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const refreshData = useCallback(() => {
    try {
      setCodes([...db.getCodes()].reverse());
      setReviews([...db.getReviews()].reverse());
    } catch (e) {
      console.error("Failed to load data", e);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete ALL reviews and codes? This cannot be undone.")) {
      db.reset();
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="text-teal-400" size={24}/> Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Pharma Feedback System</p>
        </div>
        
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-4 pb-4 md:pb-0 gap-2">
          <button onClick={() => handleTabChange('invites')} className={`flex-1 md:flex-none text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'invites' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <Smartphone size={18} /> <span>SMS Invites</span>
          </button>
          <button onClick={() => handleTabChange('reviews')} className={`flex-1 md:flex-none text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'reviews' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <FileText size={18} /> <span>Review Logs</span>
          </button>
          <button onClick={() => handleTabChange('settings')} className={`flex-1 md:flex-none text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}>
            <Settings size={18} /> <span>Settings</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-800 space-y-4">
          <a href="#/" className="text-sm hover:text-white flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <ExternalLink size={14} /> View Public Stats
          </a>
          <button onClick={handleReset} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 w-full text-left">
            <Trash2 size={14} /> Clear Database
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {{
              invites: 'Delivery Invitations',
              reviews: 'Customer Feedback Analytics',
              settings: 'System Configuration',
            }[activeTab]}
          </h2>
          {activeTab !== 'settings' && (
            <button onClick={refreshData} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-full transition-all shadow-sm" aria-label="Refresh Data">
              <RefreshCw size={20} />
            </button>
          )}
        </div>

        {activeTab === 'invites' && <InviteManager codes={codes} onDataChange={refreshData} />}
        {activeTab === 'reviews' && <AnalyticsManager reviews={reviews} />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;