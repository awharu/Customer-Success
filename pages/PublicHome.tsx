import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../services/db';
import { AggregatedMetrics, Review } from '../types';
import { Activity, Truck, Pill, ArrowRight, Star, Heart, Lock, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MetricCard from '../components/metrics/MetricCard';
import ProductProfileChart from '../components/metrics/ProductProfileChart';
import DeliveryPerformanceChart from '../components/metrics/DeliveryPerformanceChart';
import { Smartphone } from 'lucide-react';

const PublicHome: React.FC = () => {
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCode, setReviewCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setMetrics(db.getMetrics());
    setReviews(db.getReviews());
  }, []);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewCode.trim()) {
      navigate(`/review/${reviewCode.trim().toUpperCase()}`);
    }
  };

  // Filter for high quality comments for the public showcase
  const recentFeedback = useMemo(() => {
    return reviews
      .filter(r => r.comment && r.comment.length > 10 && r.productRating.quality >= 4)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
  }, [reviews]);

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Preparing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <Pill className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-xl">CustomerSuccess</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/how-it-works" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">How it works</Link>
            <a href="#metrics" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">Live Stats</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-teal-700 text-white pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            Live Quality Tracking
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Elevating Drug <br /><span className="text-teal-300">Delivery Standards.</span>
          </h1>
          <p className="text-teal-100 text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            CustomerSuccess bridges the gap between customer and seller through verified, anonymous performance tracking.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-teal-800/50 px-5 py-2.5 rounded-2xl border border-teal-600">
              <CheckCircle2 size={20} className="text-teal-300" />
              <span className="text-sm font-bold">{metrics.totalReviews} Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-800/50 px-5 py-2.5 rounded-2xl border border-teal-600">
              <Lock size={20} className="text-teal-300" />
              <span className="text-sm font-bold">100% Anonymous</span>
            </div>
          </div>
        </div>
      </section>

      {/* Manual Code Entry Form */}
      <div className="max-w-3xl mx-auto -mt-16 relative z-10 px-6">
        <form onSubmit={handleCodeSubmit} className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-6 border border-slate-100">
          <div className="flex-shrink-0 text-center md:text-left">
            <h3 className="font-black text-slate-800 text-xl">Review Code</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Check your SMS invite</p>
          </div>
          <input
            id="review-code"
            type="text"
            value={reviewCode}
            onChange={(e) => setReviewCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="XXXXXX"
            className="flex-grow w-full md:w-auto bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-center font-mono text-3xl font-black tracking-[0.5em] focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-200"
          />
          <button
            type="submit"
            disabled={!reviewCode.trim()}
            className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98]"
          >
            <span>Start Review</span>
            <ArrowRight size={24} />
          </button>
        </form>
      </div>

      {/* Recent Positive Feedback */}
      {recentFeedback.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-24">
            <div className="text-center mb-12">
                <h2 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Community Voices</h2>
                <h3 className="text-3xl font-bold text-slate-800">Recent Verified Feedback</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentFeedback.map((review) => (
                    <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-lg transition-shadow">
                        <MessageSquareQuote size={40} className="text-teal-100 absolute top-6 right-6" />
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={i < review.productRating.quality ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                            ))}
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium mb-4">"{review.comment}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                                {review.id.substring(0, 2)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Anonymous Customer</p>
                                <p className="text-[10px] text-slate-400">Verified Delivery</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* How it Works Preview Section */}
      <section id="how-it-works-preview" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Our Process</h2>
          <h3 className="text-3xl font-bold text-slate-800">Designed for Integrity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Smartphone, title: 'Secure Invite', desc: 'Customers receive a one-time secure SMS link after their delivery is completed.' },
            { icon: Lock, title: 'Total Privacy', desc: 'Reviews are encrypted and disconnected from customer identity before being aggregated.' },
            { icon: Activity, title: 'Public Insights', desc: 'Aggregated metrics are published in real-time to maintain service transparency.' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="bg-white w-20 h-20 rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center mb-6 text-teal-600">
                <item.icon size={36} />
              </div>
              <h4 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm px-4">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-teal-600 transition-colors">
                View detailed process <ArrowRight size={16} />
            </Link>
        </div>
      </section>

      {/* Metrics & Charts Section */}
      <section id="metrics" className="bg-slate-100/50 py-24 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Transparency Dashboard</h2>
              <h3 className="text-4xl font-black text-slate-900 leading-none">Verified Performance</h3>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>)}
              </div>
              <span className="text-sm font-bold text-slate-600">Last updated: Just now</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Truck}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              title="Delivery Speed"
              value={metrics.averageDelivery.speed}
              unit="/ 5"
            />
            <MetricCard
              icon={Pill}
              iconBg="bg-teal-50"
              iconColor="text-teal-600"
              title="Product Quality"
              value={metrics.averageProduct.quality}
              unit="/ 5"
            />
            <MetricCard
              icon={Star}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              title="Consumer Trust"
              value={metrics.averageDelivery.overall}
              unit="/ 5"
            />
            <MetricCard
              icon={Heart}
              iconBg="bg-rose-50"
              iconColor="text-rose-600"
              title="Effectiveness"
              value={metrics.averageProduct.effects}
              unit="/ 5"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100">
              <ProductProfileChart data={metrics.averageProduct} />
            </div>
            <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100">
              <DeliveryPerformanceChart data={metrics.averageDelivery} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Pill className="text-teal-600" size={24} />
            <span className="font-bold text-slate-800 tracking-tight text-xl">CustomerSuccess</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 Drug Quality Assurance Network. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/admin" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;