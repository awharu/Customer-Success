import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Delivery Performance</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeliveryPerformanceChart;
