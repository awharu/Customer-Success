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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Average Product Scores</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(20, 184, 172, 0.1)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar dataKey="score" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageProductRatingsChart;