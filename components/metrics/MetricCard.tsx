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
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
      <div className={`p-3 rounded-full mb-4 ${iconBg}`}>
        <Icon className={iconColor} size={32} />
      </div>
      <h3 className="text-slate-500 font-medium">{title}</h3>
      <div className="text-4xl font-bold text-slate-800 mt-2">
        {value} {unit && <span className="text-lg text-slate-400">{unit}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
