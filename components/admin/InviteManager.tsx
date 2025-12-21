import React, { useState } from 'react';
import { smsService } from '../../services/sms';
import { db } from '../../services/db';
import { AccessCode, ReviewStatus } from '../../types';
import { Send, Copy, ExternalLink, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';

interface InviteManagerProps {
  codes: AccessCode[];
  onDataChange: () => void;
}

const InviteManager: React.FC<InviteManagerProps> = ({ codes, onDataChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<string>('');
  const [smsSuccess, setSmsSuccess] = useState<boolean | null>(null);

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
        onDataChange();
      }
    } catch (error: any) {
      setSmsSuccess(false);
      setSmsStatus(`System Error: ${error?.message || 'Unexpected failure'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteCode = (code: string) => {
    if (window.confirm(`Are you sure you want to delete the invite code ${code}?`)) {
      db.deleteCode(code);
      onDataChange();
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied link!');
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">New Invitation</h3>
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div>
            <label htmlFor="phone-number" className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">NZ Phone Number</label>
            <input
              id="phone-number"
              type="tel"
              placeholder="e.g. 021 123 4567"
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-[10px] text-slate-400 mt-1">Service is for New Zealand numbers (e.g. 021, 027, 09).</p>
          </div>
          <button type="submit" disabled={isSending || !phoneNumber} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
            {isSending ? 'Sending...' : <><Send size={18} /> Dispatch via Gateway</>}
          </button>
        </form>

        {smsSuccess !== null && (
          <div className={`mt-8 p-5 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 ${smsSuccess ? 'bg-teal-50 border-teal-100' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-start gap-2 mb-3">
              {smsSuccess ? <CheckCircle size={18} className="text-teal-600 mt-0.5"/> : <AlertCircle size={18} className="text-red-600 mt-0.5"/>}
              <div>
                <p className={`text-sm font-bold ${smsSuccess ? 'text-teal-900' : 'text-red-900'}`}>{smsSuccess ? 'Request Handed Off' : 'Dispatch Failed'}</p>
                <p className={`text-xs mt-0.5 leading-tight ${smsSuccess ? 'text-teal-700' : 'text-red-700'}`}>{smsStatus}</p>
              </div>
            </div>
            {smsSuccess && <div className="flex items-start gap-2 bg-white/50 p-2 rounded border border-teal-100 mt-2 mb-4"><Info size={14} className="text-teal-500 flex-shrink-0 mt-0.5" /><p className="text-[10px] text-teal-700 leading-tight">Standard browser security prevents delivery confirmation. If the customer doesn't receive it, use the link below manually.</p></div>}
            {lastLink && (
              <>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-inner"><p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Backup Review Link</p><p className="text-xs text-slate-600 font-mono break-all leading-tight">{lastLink}</p></div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => copyToClipboard(lastLink)} className="flex-1 bg-white text-teal-600 border border-teal-200 py-2 rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"><Copy size={14}/> Copy</button>
                  <a href={lastLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"><ExternalLink size={14}/> Test</a>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b bg-slate-50 flex justify-between items-center"><h3 className="font-bold text-slate-700">Invite History</h3><span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-bold">{codes.length} total</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b"><tr><th className="p-4">Code</th><th className="p-4">Destination</th><th className="p-4">Status</th><th className="p-4">Created</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {codes.length === 0 ? (<tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No invites generated yet.</td></tr>) : (codes.map((c) => (
                <tr key={c.code} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4"><span className="font-mono bg-slate-100 px-2 py-1 rounded text-teal-700 font-bold">{c.code}</span></td>
                  <td className="p-4 font-medium text-slate-700">{c.phoneNumber}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${c.status === ReviewStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span></td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right"><button onClick={() => handleDeleteCode(c.code)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Invite"><Trash2 size={16} /></button></td>
                </tr>))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InviteManager;