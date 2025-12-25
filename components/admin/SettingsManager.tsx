import React, { useState } from 'react';
import { Save, ShieldAlert, Key, MessageSquareCode, Info, RefreshCw } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';

const SettingsManager: React.FC = () => {
  const { showToast } = useToast();
  const [username, setUsername] = useState(() => localStorage.getItem('HERO_USERNAME') || '0800437633');
  const [password, setPassword] = useState(() => localStorage.getItem('HERO_PASSWORD') || '');
  const [smsTemplate, setSmsTemplate] = useState(() => localStorage.getItem('SMS_TEMPLATE') || 'Please review your pharmacy delivery here: {{reviewLink}}');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate slight delay for professional feel
    setTimeout(() => {
        localStorage.setItem('HERO_USERNAME', username);
        localStorage.setItem('HERO_PASSWORD', password);
        localStorage.setItem('SMS_TEMPLATE', smsTemplate);
        setIsSaving(false);
        showToast('System configuration updated.', 'success');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-[#1A1025]/60 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-white/5">
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">System Config</h3>
            <p className="text-slate-400 font-medium text-sm mb-10">Configure your SMS gateway and outbound communications.</p>
            
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl mb-10 flex items-start gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="bg-red-500 p-2 rounded-xl">
                    <ShieldAlert className="text-[#0B0415]" size={20} />
                </div>
                <div>
                    <h4 className="font-black text-sm text-red-400 uppercase tracking-wide">Security Requirement</h4>
                    <p className="text-xs leading-relaxed text-red-300 mt-1 font-medium">
                        Credentials are currently stored in the browser's local sandbox. For enterprise deployments, use a dedicated server-side secrets manager.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="hero-username" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Key size={12}/> Gateway User
                        </label>
                        <input
                            id="hero-username"
                            type="text"
                            placeholder="Provider ID"
                            className="w-full bg-[#0B0415] border border-white/10 rounded-2xl p-4 font-bold text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="hero-password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Key size={12}/> Gateway Secret
                        </label>
                        <input
                            id="hero-password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-[#0B0415] border border-white/10 rounded-2xl p-4 font-bold text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="sms-template" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquareCode size={12}/> SMS Text Template
                    </label>
                    <textarea
                        id="sms-template"
                        className="w-full bg-[#0B0415] border border-white/10 rounded-2xl p-4 font-bold text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all min-h-[140px] resize-none leading-relaxed placeholder:text-slate-700"
                        value={smsTemplate}
                        onChange={(e) => setSmsTemplate(e.target.value)}
                    />
                    <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <Info size={14} className="text-slate-400"/>
                        <p className="text-[10px] text-slate-400 font-bold">
                            Placeholder: <code className="text-cyan-400 bg-cyan-900/30 px-1 rounded">{"{{reviewLink}}"}</code> will be auto-replaced.
                        </p>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] uppercase tracking-wide"
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={20}/> : <Save size={20} />}
                        {isSaving ? 'Processing Changes...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SettingsManager;