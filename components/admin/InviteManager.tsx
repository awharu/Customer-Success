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
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase">DELIVERED</span>;
      case DeliveryStatus.SENT:
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase animate-pulse">SENT</span>;
      case DeliveryStatus.FAILED:
        return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase">FAILED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 w-fit uppercase">QUEUED</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Dispatch Card */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200">
        <h3 className="text-2xl font-black text-slate-800 mb-2">Invite Customer</h3>
        <p className="text-slate-400 font-medium text-sm mb-8">Send a one-time review code via SMS.</p>
        
        <form onSubmit={handleSendInvite} className="space-y-6">
          <div>
            <label htmlFor="phone-number" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.1em]">Customer NZ Mobile</label>
            <input
              id="phone-number"
              type="tel"
              placeholder="021 000 0000"
              className="w-full border-2 border-slate-100 rounded-2xl p-4 text-lg font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isSending || !phoneNumber} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all">
            {isSending ? 'Connecting...' : <><Send size={20} /> Dispatch Now</>}
          </button>
        </form>

        {smsSuccess !== null && (
          <div className={`mt-10 p-6 rounded-3xl border animate-in slide-in-from-bottom-4 ${smsSuccess ? 'bg-teal-50 border-teal-100' : 'bg-rose-50 border-rose-100'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl ${smsSuccess ? 'bg-teal-600' : 'bg-rose-600'}`}>
                {smsSuccess ? <CheckCircle size={18} className="text-white"/> : <AlertCircle size={18} className="text-white"/>}
              </div>
              <div>
                <p className={`text-sm font-black ${smsSuccess ? 'text-teal-900' : 'text-rose-900'}`}>{smsSuccess ? 'Handoff Success' : 'Gateway Refusal'}</p>
                <p className="text-xs mt-1 text-slate-600 leading-snug">{smsStatus}</p>
              </div>
            </div>
            {lastLink && (
              <div className="mt-6 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase font-black mb-1.5 tracking-tighter">Unique Link</p>
                  <p className="text-xs text-slate-600 font-mono break-all leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">{lastLink}</p>
                </div>
                <button onClick={() => copyToClipboard(lastLink)} className="w-full bg-white text-slate-900 border-2 border-slate-100 py-3 rounded-xl text-sm font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <Copy size={16}/> Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Dispatch Logs</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Live Tracking History</p>
          </div>
          <button 
            onClick={() => handleSync()} 
            disabled={isSyncing}
            className="text-xs flex items-center gap-2 text-white bg-slate-900 font-black hover:bg-slate-800 px-6 py-3 rounded-2xl transition-all shadow-lg disabled:opacity-50"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Force Sync'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
              <tr>
                <th className="p-6">Customer Contact</th>
                <th className="p-6">Gateway Status</th>
                <th className="p-6">Review State</th>
                <th className="p-6">Access Code</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {codes.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic font-medium">No invitations dispatched yet.</td></tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.code} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-slate-800">{c.phoneNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tighter">REF: {c.providerMessageId || 'LOCAL_ONLY'}</div>
                    </td>
                    <td className="p-6">{getDeliveryBadge(c.deliveryStatus)}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${c.status === ReviewStatus.COMPLETED ? 'bg-teal-100 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-6"><span className="font-mono bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700 font-black tracking-widest border border-slate-200">{c.code}</span></td>
                    <td className="p-6 text-right">
                      <button onClick={() => handleDeleteCode(c.code)} className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
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