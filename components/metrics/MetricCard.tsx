import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string | number;
  unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, iconBg, iconColor, title, value, unit }) => {
  return (
    <div className="bg-[#1A1025]/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex flex-col items-center hover:border-cyan-500/30 transition-colors shadow-lg shadow-black/20">
      <div className={`p-4 rounded-full mb-4 bg-slate-800/50 border border-white/5`}>
        <Icon className={iconColor} size={28} />
      </div>
      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">{title}</h3>
      <div className="text-4xl font-black text-white mt-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        {value} {unit && <span className="text-lg text-slate-500 font-medium">{unit}</span>}
      </div>
    </div>
  );
};

export default MetricCard;