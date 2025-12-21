import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { AggregatedMetrics } from '../types';
import { Activity, Truck, Pill, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/metrics/MetricCard';
import ProductProfileChart from '../components/metrics/ProductProfileChart';
import DeliveryPerformanceChart from '../components/metrics/DeliveryPerformanceChart';

const PublicHome: React.FC = () => {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);

  useEffect(() => {
    setMetrics(db.getMetrics());
  }, []);

  if (!metrics) {
    return <div className="p-10 text-center">Loading metrics...</div>;
  }

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
          <MetricCard
            icon={Truck}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Delivery Experience"
            value={metrics.averageDelivery.overall}
            unit="/ 5"
          />
          <MetricCard
            icon={Pill}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title="Product Quality"
            value={metrics.averageProduct.quality}
            unit="/ 5"
          />
          <MetricCard
            icon={Activity}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            title="Effectiveness"
            value={metrics.averageProduct.effects}
            unit="/ 5"
          />
          <MetricCard
            icon={ShieldCheck}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            title="Trust Score"
            value="98%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <ProductProfileChart data={metrics.averageProduct} />
          <DeliveryPerformanceChart data={metrics.averageDelivery} />
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