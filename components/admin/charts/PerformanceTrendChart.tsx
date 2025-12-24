import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Review } from '../../../types';

interface PerformanceTrendChartProps {
  reviews: Review[];
}

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ reviews }) => {
  // Sort reviews by date ascending
  const sorted = [...reviews].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Transform data for chart
  const data = sorted.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-NZ', { day: '2-digit', month: 'short' }),
    fullDate: new Date(r.timestamp).toLocaleString(),
    product: r.productRating.quality,
    delivery: r.deliveryRating.overall,
    comment: r.comment || ''
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-lg font-bold text-slate-800">Performance Timeline</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Quality (Teal) vs Delivery (Blue) Trends</p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
            />
            <YAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)',
                border: 'none',
                fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area 
                type="monotone" 
                dataKey="product" 
                name="Product Quality"
                stroke="#14b8a6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorProduct)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
                type="monotone" 
                dataKey="delivery" 
                name="Delivery Svc"
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorDelivery)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;