import React, { useState, useEffect } from 'react';
import { smsService } from '../../services/sms';
import { db } from '../../services/db';
import { AccessCode, ReviewStatus, DeliveryStatus } from '../../types';
import { Send, Copy, ExternalLink, CheckCircle, AlertCircle, Info, Trash2, RefreshCw, Clock } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';

interface InviteManagerProps {
  codes: AccessCode[];
  onDataChange: () => void;
}

const InviteManager: React.FC<InviteManagerProps> = ({ codes, onDataChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<string>('');
  const [smsSuccess, setSmsSuccess] = useState<boolean | null>(null);
  const { showToast } = useToast();

  // Background polling effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleSync(true);
    }, 20000); // Poll every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSync = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    await smsService.syncStatuses();
    onDataChange();
    if (!silent) {
      setIsSyncing(false);
      showToast('Delivery statuses synchronized.', 'info');
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    // Basic NZ phone validation
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!/^(02[0-9]{7,10}|64[0-9]{7,12})$/.test(cleanPhone)) {
        showToast('Invalid NZ phone format.', 'error');
        return;
    }

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
        onDataChange();
        showToast('SMS dispatched to gateway.', 'success');
      } else {
        showToast('SMS dispatch failed.', 'error');
      }
    } catch (error: any) {
      setSmsSuccess(false);
      setSmsStatus(`System Error: ${error?.message || 'Unexpected failure'}`);
      showToast('Gateway connection error.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteCode = (code: string) => {
    if (window.confirm(`Delete code ${code}? This customer will no longer be able to leave a review.`)) {
      db.deleteCode(code);
      onDataChange();
      showToast('Invite code removed.', 'info');
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Review link copied!', 'success');
    });
  };

  const getDeliveryBadge = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.DELIVERED:
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase">DELIVERED</span>;
      case DeliveryStatus.SENT:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase animate-pulse">SENT</span>;
      case DeliveryStatus.FAILED:
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase">FAILED</span>;
      default:
        return <span className="bg-white/5 text-slate-400 border border-white/5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase">QUEUED</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Dispatch Card */}
      <div className="bg-[#1A1025]/60 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-white/5">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Invite Customer</h3>
        <p className="text-slate-400 font-medium text-sm mb-8">Send a one-time review code via SMS.</p>
        
        <form onSubmit={handleSendInvite} className="space-y-6">
          <div>
            <label htmlFor="phone-number" className="block text-[10px] font-black text-cyan-400 mb-2 uppercase tracking-[0.1em]">Customer NZ Mobile</label>
            <input
              id="phone-number"
              type="tel"
              placeholder="021 000 0000"
              className="w-full bg-[#0B0415] border border-white/10 rounded-2xl p-4 text-lg font-bold text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isSending || !phoneNumber} className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] uppercase tracking-wide">
            {isSending ? 'Connecting...' : <><Send size={20} /> Dispatch Now</>}
          </button>
        </form>

        {smsSuccess !== null && (
          <div className={`mt-10 p-6 rounded-3xl border animate-in slide-in-from-bottom-4 ${smsSuccess ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl ${smsSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
                {smsSuccess ? <CheckCircle size={18} className="text-[#0B0415]"/> : <AlertCircle size={18} className="text-[#0B0415]"/>}
              </div>
              <div>
                <p className={`text-sm font-black ${smsSuccess ? 'text-green-400' : 'text-red-400'}`}>{smsSuccess ? 'Handoff Success' : 'Gateway Refusal'}</p>
                <p className="text-xs mt-1 text-slate-400 leading-snug">{smsStatus}</p>
              </div>
            </div>
            {lastLink && (
              <div className="mt-6 space-y-4">
                <div className="bg-[#0B0415] p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1.5 tracking-tighter">Unique Link</p>
                  <p className="text-xs text-cyan-400 font-mono break-all leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">{lastLink}</p>
                </div>
                <button onClick={() => copyToClipboard(lastLink)} className="w-full bg-[#0B0415] text-white border border-white/10 py-3 rounded-xl text-sm font-black hover:bg-white/5 hover:border-cyan-400/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                  <Copy size={16}/> Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="xl:col-span-2 bg-[#1A1025]/60 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-white tracking-wide uppercase">Dispatch Logs</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Live Tracking History</p>
          </div>
          <button 
            onClick={() => handleSync()} 
            disabled={isSyncing}
            className="text-xs flex items-center gap-2 text-black bg-white font-black hover:bg-cyan-400 px-6 py-3 rounded-2xl transition-all shadow-lg disabled:opacity-50 uppercase tracking-wider"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Force Sync'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="bg-[#0B0415] text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
              <tr>
                <th className="p-6">Customer Contact</th>
                <th className="p-6">Gateway Status</th>
                <th className="p-6">Review State</th>
                <th className="p-6">Access Code</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {codes.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-500 italic font-medium">No invitations dispatched yet.</td></tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.code} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-white">{c.phoneNumber}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-tighter">REF: {c.providerMessageId || 'LOCAL_ONLY'}</div>
                    </td>
                    <td className="p-6">{getDeliveryBadge(c.deliveryStatus)}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${c.status === ReviewStatus.COMPLETED ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-6"><span className="font-mono bg-[#0B0415] px-3 py-1.5 rounded-xl text-yellow-400 font-black tracking-widest border border-white/10">{c.code}</span></td>
                    <td className="p-6 text-right">
                      <button onClick={() => handleDeleteCode(c.code)} className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 size={18} />
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
  );
};

export default InviteManager;