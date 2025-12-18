import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../services/db';
import { smsService } from '../services/sms';
import { aiService } from '../services/ai';
import { AccessCode, Review, ReviewStatus } from '../types';
import { Send, Smartphone, FileText, Sparkles, RefreshCw, Copy, ExternalLink, CheckCircle, Trash2, AlertCircle, Info, BrainCircuit } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'invites' | 'reviews' | null;
  
  const [activeTab, setActiveTab] = useState<'invites' | 'reviews'>(tabParam || 'invites');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<string>('');
  const [smsSuccess, setSmsSuccess] = useState<boolean | null>(null);
  
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);

  const refreshData = () => {
    try {
      setCodes([...db.getCodes()].reverse());
      setReviews([...db.getReviews()].reverse());
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleTabChange = (tab: 'invites' | 'reviews') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsSending(true);
    setLastLink(null);
    setSmsStatus('');
    setSmsSuccess(null);
    
    try {
      const result = await smsService.sendInvite(phoneNumber);
      setSmsSuccess(result.success);
      setSmsStatus(result.message);
      setLastLink(result.link || null);
      
      if (result.success) {
        setPhoneNumber('');
        refreshData();
      }
    } catch (error: any) {
      setSmsSuccess(false);
      setSmsStatus(`System Error: ${error?.message || 'Unexpected failure'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete ALL reviews and codes? This cannot be undone.")) {
      db.reset();
      refreshData();
      setAiSummary('');
      setLastLink(null);
    }
  };

  const handleDeleteCode = (code: string) => {
    if (window.confirm(`Are you sure you want to delete the invite code ${code}?`)) {
      db.deleteCode(code);
      refreshData();
    }
  };

  const generateSummary = async () => {
    setIsSummarizing(true);
    try {
      const summary = await aiService.summarizeReviews(reviews, useThinkingMode);
      setAiSummary(summary);
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
      setAiSummary("An error occurred while generating the summary. Please check your API configuration.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied link!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="text-teal-400" size={24}/> Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Pharma Feedback System</p>
        </div>
        
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-4 pb-4 md:pb-0 gap-2">
          <button
            onClick={() => handleTabChange('invites')}
            className={`flex-1 md:flex-none text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeTab === 'invites' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-slate-800'
            }`}
          >
            <Smartphone size={18} /> 
            <span>SMS Invites</span>
          </button>
          <button
            onClick={() => handleTabChange('reviews')}
            className={`flex-1 md:flex-none text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              activeTab === 'reviews' ? 'bg-teal-600 text-white shadow-lg' : 'hover:bg-slate-800'
            }`}
          >
            <FileText size={18} /> 
            <span>Review Logs</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-800 space-y-4">
          <a href="#/" className="text-sm hover:text-white flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <ExternalLink size={14} /> View Public Stats
          </a>
          <button 
            onClick={handleReset}
            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 w-full text-left"
          >
            <Trash2 size={14} /> Clear Database
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
                {activeTab === 'invites' ? 'Delivery Invitations' : 'Customer Feedback Analytics'}
            </h2>
            <button onClick={refreshData} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-full transition-all shadow-sm">
                <RefreshCw size={20} />
            </button>
        </div>

        {activeTab === 'invites' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">New Invitation</h3>
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 021 123 4567"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">NZ format preferred (e.g. 021...)</p>
                </div>
                <button
                  type="submit"
                  disabled={isSending || !phoneNumber}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {isSending ? 'Sending...' : <><Send size={18} /> Dispatch via Gateway</>}
                </button>
              </form>

              {smsSuccess !== null && (
                <div className={`mt-8 p-5 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 ${
                  smsSuccess ? 'bg-teal-50 border-teal-100' : 'bg-red-50 border-red-100'
                }`}>
                  <div className="flex items-start gap-2 mb-3">
                    {smsSuccess ? (
                      <CheckCircle size={18} className="text-teal-600 mt-0.5"/>
                    ) : (
                      <AlertCircle size={18} className="text-red-600 mt-0.5"/>
                    )}
                    <div>
                      <p className={`text-sm font-bold ${smsSuccess ? 'text-teal-900' : 'text-red-900'}`}>
                        {smsSuccess ? 'Request Handed Off' : 'Dispatch Failed'}
                      </p>
                      <p className={`text-xs mt-0.5 leading-tight ${smsSuccess ? 'text-teal-700' : 'text-red-700'}`}>
                        {smsStatus}
                      </p>
                    </div>
                  </div>
                  
                  {smsSuccess && (
                    <div className="flex items-start gap-2 bg-white/50 p-2 rounded border border-teal-100 mt-2 mb-4">
                      <Info size={14} className="text-teal-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-teal-700 leading-tight">
                        Standard browser security prevents delivery confirmation. If the customer doesn't receive it, use the link below manually.
                      </p>
                    </div>
                  )}
                  
                  {lastLink && (
                    <>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-inner">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Backup Review Link</p>
                        <p className="text-xs text-slate-600 font-mono break-all leading-tight">{lastLink}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => copyToClipboard(lastLink)}
                          className="flex-1 bg-white text-teal-600 border border-teal-200 py-2 rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Copy size={14}/> Copy
                        </button>
                        <a 
                          href={lastLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={14}/> Test
                        </a>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Invite History</h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-bold">{codes.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b">
                    <tr>
                      <th className="p-4">Code</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Created</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {codes.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No invites generated yet.</td></tr>
                    ) : (
                        codes.map((c) => (
                        <tr key={c.code} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4"><span className="font-mono bg-slate-100 px-2 py-1 rounded text-teal-700 font-bold">{c.code}</span></td>
                            <td className="p-4 font-medium text-slate-700">{c.phoneNumber}</td>
                            <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                c.status === ReviewStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {c.status}
                            </span>
                            </td>
                            <td className="p-4 text-slate-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => handleDeleteCode(c.code)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Invite"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl border border-indigo-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BrainCircuit size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <div className="flex items-center gap-3">
                          <div className="bg-indigo-500/30 p-2 rounded-xl">
                            <Sparkles className="text-indigo-200" size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">AI Feedback Analyst</h3>
                            <p className="text-xs text-indigo-300">Generates insights from customer comments.</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap justify-end">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setUseThinkingMode(!useThinkingMode)}>
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${ useThinkingMode ? 'bg-indigo-400' : 'bg-white/20' }`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${ useThinkingMode ? 'translate-x-6' : 'translate-x-1' }`}/>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-white cursor-pointer select-none">
                                    Deep Analysis
                                </label>
                                <p className="text-[11px] text-indigo-300 group-hover:text-indigo-100 transition-colors">Slower, more thorough results.</p>
                            </div>
                        </div>
                        <button 
                            onClick={generateSummary}
                            disabled={isSummarizing || reviews.length === 0}
                            className="bg-white text-indigo-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 disabled:opacity-30 transition-all shadow-lg flex items-center gap-2"
                        >
                            {isSummarizing ? <><RefreshCw className="animate-spin" size={16}/> Analyzing...</> : 'Summarize Themes'}
                        </button>
                      </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 min-h-[100px] text-indigo-50 text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {aiSummary || (reviews.length === 0 ? "Wait for your first review to use AI analytics." : "Generate a report to see key themes across all customer comments.")}
                  </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b bg-slate-50">
                    <h3 className="font-bold text-slate-800">Customer Review Logs</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b">
                        <tr>
                        <th className="p-4">Ref ID</th>
                        <th className="p-4">Overall Score</th>
                        <th className="p-4">Delivery</th>
                        <th className="p-4">Product</th>
                        <th className="p-4 min-w-[300px]">Comments</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                         {reviews.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No feedback received yet.</td></tr>
                        ) : (
                            reviews.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono text-[10px] text-slate-400">#{r.id.substring(0,6)}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <span className={`font-bold px-2 py-1 rounded text-white ${
                                          r.deliveryRating.overall >= 4 ? 'bg-green-500' : r.deliveryRating.overall >= 2 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}>{r.deliveryRating.overall}</span>
                                        <span className="text-slate-400">/5</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600 font-medium">S:{r.deliveryRating.speed} C:{r.deliveryRating.communication}</td>
                                <td className="p-4 text-slate-600 font-medium">Q:{r.productRating.quality} T:{r.productRating.taste}</td>
                                <td className="p-4 text-slate-700 italic">
                                  {r.comment ? <div className="bg-slate-100/50 p-2 rounded border border-slate-100 leading-snug">"{r.comment}"</div> : <span className="text-slate-300">-</span>}
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;