import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DeliveryRating } from '../../types';

interface DeliveryPerformanceChartProps {
  data: DeliveryRating;
}

const DeliveryPerformanceChart: React.FC<DeliveryPerformanceChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Speed', score: data.speed },
    { name: 'Comms', score: data.communication },
    { name: 'Overall', score: data.overall },
  ];

  return (
    <div className="bg-[#1A1025]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        Delivery Stats
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
               cursor={{ fill: 'rgba(255,255,255,0.05)' }}
               contentStyle={{
                backgroundColor: '#0f0518',
                borderColor: '#334155',
                color: '#fff',
                borderRadius: '12px'
              }}
            />
            <Bar dataKey="score" fill="#FAFF00" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeliveryPerformanceChart;