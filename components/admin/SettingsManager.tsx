import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';

const SettingsManager: React.FC = () => {
  // Use lazy initializer for useState to read from localStorage only once on mount.
  // This is more performant as it avoids a re-render.
  const [username, setUsername] = useState(() => localStorage.getItem('HERO_USERNAME') || '0800437633');
  const [password, setPassword] = useState(() => localStorage.getItem('HERO_PASSWORD') || '');
  const [smsTemplate, setSmsTemplate] = useState(() => localStorage.getItem('SMS_TEMPLATE') || 'Please review your pharmacy delivery here: {{reviewLink}}');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('HERO_USERNAME', username);
    localStorage.setItem('HERO_PASSWORD', password);
    localStorage.setItem('SMS_TEMPLATE', smsTemplate);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000); // Hide message after 3s
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-lg mx-auto">
        <h3 className="font-bold text-slate-800 mb-4">Service Credentials & Templates</h3>
        
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={20} />
            <div>
                <h4 className="font-bold text-sm">Security Warning</h4>
                <p className="text-xs leading-relaxed">
                    These credentials will be stored in your browser's local storage. This method is not secure for production environments. Do not use real, sensitive credentials in a public-facing application.
                </p>
            </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
            <div>
                <label htmlFor="hero-username" className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">SMS Gateway Username</label>
                <input
                    id="hero-username"
                    type="text"
                    placeholder="Enter your SMS provider username"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
             <div>
                <label htmlFor="hero-password" className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">SMS Gateway Password</label>
                <input
                    id="hero-password"
                    type="password"
                    placeholder="Enter your SMS provider password"
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <hr className="border-slate-100" />

            <div>
                <label htmlFor="sms-template" className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">SMS Message Template</label>
                <textarea
                  id="sms-template"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all min-h-[100px]"
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Use <code>{"{{reviewLink}}"}</code> as a placeholder for the unique review URL.
                </p>
            </div>

            <div className="flex items-center justify-between pt-2">
                 {saved && <span className="text-sm text-green-600 animate-in fade-in">Settings saved successfully!</span>}
                 <button type="submit" className="ml-auto w-auto bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
                    <Save size={18} /> Save Settings
                </button>
            </div>
        </form>
    </div>
  );
};

export default SettingsManager;