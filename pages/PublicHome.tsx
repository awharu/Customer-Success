import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { AggregatedMetrics } from '../types';
import { Activity, Truck, Pill, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MetricCard from '../components/metrics/MetricCard';
import ProductProfileChart from '../components/metrics/ProductProfileChart';
import DeliveryPerformanceChart from '../components/metrics/DeliveryPerformanceChart';

const PublicHome: React.FC = () => {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [reviewCode, setReviewCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setMetrics(db.getMetrics());
  }, []);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewCode.trim()) {
      navigate(`/review/${reviewCode.trim().toUpperCase()}`);
    }
  };

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

      {/* Manual Code Entry Form */}
      <div className="max-w-3xl mx-auto -mt-12 relative z-10 px-4">
        <form onSubmit={handleCodeSubmit} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-4 border border-slate-100">
          <label htmlFor="review-code" className="font-bold text-slate-700 text-lg flex-shrink-0 whitespace-nowrap">
            Have a review code?
          </label>
          <input
            id="review-code"
            type="text"
            value={reviewCode}
            onChange={(e) => setReviewCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="ENTER CODE"
            className="flex-grow w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-center font-mono text-xl tracking-widest focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:tracking-normal"
          />
          <button
            type="submit"
            disabled={!reviewCode.trim()}
            className="w-full sm:w-auto bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Start Review</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>

      {/* Metrics & Charts Section */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-20">
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
