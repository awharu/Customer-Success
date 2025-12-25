import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../services/db';
import { AggregatedMetrics, Review } from '../types';
import { Activity, Truck, Zap, ArrowRight, Star, Heart, Lock, ShieldCheck, MessageSquareQuote } from 'lucide-react';
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

  const recentFeedback = useMemo(() => {
    return reviews
      .filter(r => r.comment && r.comment.length > 10 && r.productRating.quality >= 4)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
  }, [reviews]);

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0415]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs">Initializing System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0415] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <nav className="bg-[#0f0518]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Logo Representation */}
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-[#0B0415] rounded-full border border-white/10 p-2">
                    <Zap className="text-yellow-400" size={24} fill="#FAFF00" />
                </div>
             </div>
             <div className="flex flex-col leading-none">
                <span className="font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">SEVENS</span>
                <span className="font-bold text-sm tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">24/7</span>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/how-it-works" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors">How it works</Link>
            <a href="#metrics" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors">Live Stats</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_#22d3ee]"></span>
            Live Quality Tracking
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none text-white drop-shadow-2xl">
            PREMIUM <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">DELIVERY</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-500">STANDARDS.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Bridging the gap between customer and seller through verified, anonymous performance tracking.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 bg-[#1A1025]/50 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-green-500/50 transition-colors">
              <ShieldCheck size={20} className="text-green-400" />
              <span className="text-sm font-bold text-white tracking-wide">{metrics.totalReviews} Verified Reviews</span>
            </div>
            <div className="flex items-center gap-3 bg-[#1A1025]/50 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
              <Lock size={20} className="text-cyan-400" />
              <span className="text-sm font-bold text-white tracking-wide">100% Anonymous</span>
            </div>
          </div>
        </div>
      </section>

      {/* Manual Code Entry Form */}
      <div className="max-w-3xl mx-auto -mt-24 relative z-20 px-6">
        <form onSubmit={handleCodeSubmit} className="bg-[#1A1025]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/50 p-2 flex flex-col md:flex-row items-center gap-2 border border-white/10">
          <div className="pl-8 py-6 pr-4 flex-shrink-0 text-center md:text-left">
            <h3 className="font-black text-white text-lg tracking-wide uppercase">Review Code</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Check your SMS</p>
          </div>
          <input
            id="review-code"
            type="text"
            value={reviewCode}
            onChange={(e) => setReviewCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="XXXXXX"
            className="flex-grow w-full md:w-auto bg-[#0B0415] border border-white/10 rounded-[1.8rem] p-6 text-center font-mono text-3xl font-black tracking-[0.3em] text-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-700 uppercase"
          />
          <button
            type="submit"
            disabled={!reviewCode.trim()}
            className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-8 rounded-[1.8rem] font-black text-lg hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-[0.98]"
          >
            <span>START</span>
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </form>
      </div>

      {/* Recent Positive Feedback */}
      {recentFeedback.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-32">
            <div className="text-center mb-16">
                <h2 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">Community Voices</h2>
                <h3 className="text-3xl font-bold text-white">Recent Verified Feedback</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentFeedback.map((review) => (
                    <div key={review.id} className="bg-[#1A1025]/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative group hover:border-cyan-500/30 transition-all hover:-translate-y-1">
                        <MessageSquareQuote size={40} className="text-white/5 absolute top-6 right-6" />
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.productRating.quality ? "#FAFF00" : "none"} className={i < review.productRating.quality ? "text-yellow-400" : "text-slate-700"} />
                            ))}
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium mb-6 text-sm">"{review.comment}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-slate-400 font-black text-xs shadow-inner">
                                {review.id.substring(0, 2)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-wide">Verified Customer</p>
                                <p className="text-[10px] text-cyan-400 font-mono mt-0.5">ID: {review.id}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* How it Works Preview Section */}
      <section id="how-it-works-preview" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_10px_rgba(192,132,252,0.6)]">The Process</h2>
          <h3 className="text-3xl font-bold text-white">Designed for Integrity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Smartphone, title: 'Secure Invite', desc: 'Customers receive a one-time secure SMS link after their delivery is completed.', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
            { icon: Lock, title: 'Total Privacy', desc: 'Reviews are encrypted and disconnected from customer identity before being aggregated.', color: 'text-purple-400', glow: 'shadow-purple-500/20' },
            { icon: Activity, title: 'Public Insights', desc: 'Aggregated metrics are published in real-time to maintain service transparency.', color: 'text-green-400', glow: 'shadow-green-500/20' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className={`w-24 h-24 rounded-[2rem] bg-[#1A1025] border border-white/10 flex items-center justify-center mb-8 ${item.color} shadow-2xl ${item.glow} group-hover:scale-110 transition-transform duration-500`}>
                <item.icon size={40} />
              </div>
              <h4 className="font-bold text-xl text-white mb-4 uppercase tracking-wide">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed text-sm px-4">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-20">
            <Link to="/how-it-works" className="inline-flex items-center gap-3 text-white font-bold hover:text-cyan-400 transition-colors uppercase tracking-widest text-xs border border-white/10 px-8 py-4 rounded-full hover:bg-white/5 hover:border-cyan-400/50">
                View detailed process <ArrowRight size={16} />
            </Link>
        </div>
      </section>

      {/* Metrics & Charts Section */}
      <section id="metrics" className="bg-[#0f0518]/50 py-32 px-6 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0B0415] to-[#0B0415] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-xs font-black text-green-400 uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">Transparency Dashboard</h2>
              <h3 className="text-4xl font-black text-white leading-none">Verified Performance</h3>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10 flex items-center gap-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                 <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">System Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Truck}
              iconBg=""
              iconColor="text-blue-400"
              title="Delivery Speed"
              value={metrics.averageDelivery.speed}
              unit="/ 5"
            />
            <MetricCard
              icon={Zap}
              iconBg=""
              iconColor="text-yellow-400"
              title="Product Quality"
              value={metrics.averageProduct.quality}
              unit="/ 5"
            />
            <MetricCard
              icon={Star}
              iconBg=""
              iconColor="text-purple-400"
              title="Consumer Trust"
              value={metrics.averageDelivery.overall}
              unit="/ 5"
            />
            <MetricCard
              icon={Heart}
              iconBg=""
              iconColor="text-red-400"
              title="Effectiveness"
              value={metrics.averageProduct.effects}
              unit="/ 5"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <ProductProfileChart data={metrics.averageProduct} />
            <DeliveryPerformanceChart data={metrics.averageDelivery} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#08020F] py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <Zap className="text-yellow-400" size={20} fill="#FAFF00" />
            <span className="font-black text-white tracking-tight text-lg">SEVENS 24/7</span>
          </div>
          <p className="text-slate-600 text-xs">© 2025 Drug Quality Assurance Network. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/admin" className="text-xs font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;