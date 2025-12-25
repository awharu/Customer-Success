import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ProductRating } from '../../../types';

interface ChartProps {
  data: ProductRating;
}

const AverageProductRatingsChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Quality', score: data.quality },
    { name: 'Effects', score: data.effects },
    { name: 'Taste', score: data.taste },
    { name: 'Weight', score: data.weight },
  ];

  return (
    <div className="bg-[#1A1025]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Average Product Scores</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(34, 211, 238, 0.05)' }}
              contentStyle={{
                backgroundColor: '#0f0518',
                borderColor: '#334155',
                color: '#fff',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="score" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageProductRatingsChart;