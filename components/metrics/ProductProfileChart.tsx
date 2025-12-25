import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { ProductRating } from '../../types';

interface ProductProfileChartProps {
  data: ProductRating;
}

const ProductProfileChart: React.FC<ProductProfileChartProps> = ({ data }) => {
  const chartData = [
    { subject: 'Quality', A: data.quality, fullMark: 5 },
    { subject: 'Effects', A: data.effects, fullMark: 5 },
    { subject: 'Taste', A: data.taste, fullMark: 5 },
    { subject: 'Weight', A: data.weight, fullMark: 5 },
  ];

  return (
    <div className="bg-[#1A1025]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Product Profile
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
            <Radar
              name="Product"
              dataKey="A"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="#22d3ee"
              fillOpacity={0.2}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0f0518',
                borderColor: '#334155',
                color: '#fff',
                borderRadius: '12px'
              }}
              itemStyle={{ color: '#22d3ee' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductProfileChart;