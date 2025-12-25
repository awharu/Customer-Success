import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DeliveryRating } from '../../../types';

interface ChartProps {
  data: DeliveryRating;
}

const AverageDeliveryRatingsChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Speed', score: data.speed },
    { name: 'Comms', score: data.communication },
    { name: 'Overall', score: data.overall },
  ];

  return (
    <div className="bg-[#1A1025]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Average Delivery Scores</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(217, 70, 239, 0.05)' }}
              contentStyle={{
                backgroundColor: '#0f0518',
                borderColor: '#334155',
                color: '#fff',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="score" fill="#d946ef" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageDeliveryRatingsChart;