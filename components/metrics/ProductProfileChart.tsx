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
    { subject: 'Look', A: data.appearance, fullMark: 5 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Product Profile Analysis</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar
              name="Product"
              dataKey="A"
              stroke="#0d9488"
              fill="#14b8a6"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductProfileChart;
