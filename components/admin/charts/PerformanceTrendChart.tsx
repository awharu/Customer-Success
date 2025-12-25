import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Review } from '../../../types';

interface PerformanceTrendChartProps {
  reviews: Review[];
}

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ reviews }) => {
  const sorted = [...reviews].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  const data = sorted.map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-NZ', { day: '2-digit', month: 'short' }),
    fullDate: new Date(r.timestamp).toLocaleString(),
    product: r.productRating.quality,
    delivery: r.deliveryRating.overall,
    comment: r.comment || ''
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-[#1A1025]/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Performance Timeline</h3>
            <p className="text-xs text-slate-500 font-bold mt-1">Quality (Cyan) vs Delivery (Purple) Trends</p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} 
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
            />
            <YAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f0518',
                borderColor: '#334155',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ opacity: 0.8 }} />
            <Area 
                type="monotone" 
                dataKey="product" 
                name="Product Quality"
                stroke="#22d3ee" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorProduct)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
            />
            <Area 
                type="monotone" 
                dataKey="delivery" 
                name="Delivery Svc"
                stroke="#d946ef" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorDelivery)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;