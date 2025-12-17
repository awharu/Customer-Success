import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { AggregatedMetrics } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Truck, Pill, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicHome: React.FC = () => {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);

  useEffect(() => {
    setMetrics(db.getMetrics());
  }, []);

  if (!metrics) return <div className="p-10 text-center">Loading metrics...</div>;

  const radarData = [
    { subject: 'Quality', A: metrics.averageProduct.quality, fullMark: 5 },
    { subject: 'Effects', A: metrics.averageProduct.effects, fullMark: 5 },
    { subject: 'Taste', A: metrics.averageProduct.taste, fullMark: 5 },
    { subject: 'Look', A: metrics.averageProduct.appearance, fullMark: 5 },
  ];

  const deliveryData = [
    { name: 'Speed', score: metrics.averageDelivery.speed },
    { name: 'Comms', score: metrics.averageDelivery.communication },
    { name: 'Overall', score: metrics.averageDelivery.overall },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-teal-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">PharmaFeedback Transparency</h1>
          <p className="text-teal-100 text-lg mb-8">
            Real-time, anonymous quality assurance for pharmacy deliveries.
            <br /> Trusted by patients, verified by code.
          </p>
          <div className="inline-block bg-teal-800 rounded-full px-6 py-2 text-sm font-semibold">
            {metrics.totalReviews} Verified Reviews
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Overall Delivery */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Truck className="text-blue-600" size={32} />
            </div>
            <h3 className="text-slate-500 font-medium">Delivery Experience</h3>
            <div className="text-4xl font-bold text-slate-800 mt-2">
              {metrics.averageDelivery.overall} <span className="text-lg text-slate-400">/ 5</span>
            </div>
          </div>

           {/* Card 2: Product Quality */}
           <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="bg-emerald-100 p-3 rounded-full mb-4">
              <Pill className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-slate-500 font-medium">Product Quality</h3>
            <div className="text-4xl font-bold text-slate-800 mt-2">
              {metrics.averageProduct.quality} <span className="text-lg text-slate-400">/ 5</span>
            </div>
          </div>

          {/* Card 3: Effectiveness */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Activity className="text-purple-600" size={32} />
            </div>
            <h3 className="text-slate-500 font-medium">Effectiveness</h3>
            <div className="text-4xl font-bold text-slate-800 mt-2">
              {metrics.averageProduct.effects} <span className="text-lg text-slate-400">/ 5</span>
            </div>
          </div>

           {/* Card 4: Trust Score */}
           <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <ShieldCheck className="text-amber-600" size={32} />
            </div>
            <h3 className="text-slate-500 font-medium">Trust Score</h3>
            <div className="text-4xl font-bold text-slate-800 mt-2">
              98%
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
          {/* Radar Chart: Product Profile */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Product Profile Analysis</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
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

          {/* Bar Chart: Delivery Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Delivery Performance</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-slate-500">Are you an administrator?</p>
            <Link to="/admin" className="text-teal-600 font-semibold hover:underline">Log in to Admin Panel</Link>
        </div>
      </div>
    </div>
  );
};

export default PublicHome;