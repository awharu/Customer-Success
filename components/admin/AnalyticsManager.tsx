import React, { useState, useMemo } from 'react';
import { aiService } from '../../services/ai';
import { Review, AggregatedMetrics } from '../../types';
import { Sparkles, RefreshCw, BrainCircuit, Copy, Check, Search, Filter } from 'lucide-react';
import AverageProductRatingsChart from './charts/AverageProductRatingsChart';
import AverageDeliveryRatingsChart from './charts/AverageDeliveryRatingsChart';
import PerformanceTrendChart from './charts/PerformanceTrendChart';
import { useToast } from '../ui/ToastProvider';

interface AnalyticsManagerProps {
  reviews: Review[];
  metrics: AggregatedMetrics | null;
}

const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ reviews, metrics }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const filteredReviews = useMemo(() => {
    if (!searchTerm) return reviews;
    const lower = searchTerm.toLowerCase();
    return reviews.filter(r => 
      r.comment?.toLowerCase().includes(lower) || 
      r.code.toLowerCase().includes(lower) ||
      r.id.toLowerCase().includes(lower)
    );
  }, [reviews, searchTerm]);

  const generateSummary = async () => {
    setIsSummarizing(true);
    setAiSummary('');
    try {
      const summary = await aiService.summarizeReviews(reviews, useThinkingMode);
      setAiSummary(summary);
      showToast('Summary generated successfully.', 'success');
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
      setAiSummary("An error occurred while generating the summary. Please check your API configuration.");
      showToast('AI analysis failed.', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const copySummary = () => {
    if (!aiSummary) return;
    navigator.clipboard.writeText(aiSummary);
    setCopied(true);
    showToast('Summary copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* AI Assistant Card */}
      <div className="bg-[#1A1025]/60 p-1 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-cyan-400 rotate-12"><BrainCircuit size={160} /></div>
        <div className="bg-[#1A1025]/80 backdrop-blur-md rounded-[2.4rem] p-10 relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-cyan-500/10 p-5 rounded-3xl border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <Sparkles className="text-cyan-400" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-wide uppercase">AI Feedback Analyst</h3>
                <p className="text-slate-400 font-medium mt-1">Transforming customer comments into strategic insights.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
              <div 
                className="flex items-center gap-3 cursor-pointer select-none bg-[#0B0415] px-5 py-3 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all"
                onClick={() => setUseThinkingMode(!useThinkingMode)}
              >
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${useThinkingMode ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${useThinkingMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <div>
                  <label className="text-sm font-bold text-white cursor-pointer uppercase tracking-wider">Deep Analysis</label>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">More precise results</p>
                </div>
              </div>

              <button 
                onClick={generateSummary} 
                disabled={isSummarizing || reviews.length === 0} 
                className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-cyan-400 transition-all disabled:opacity-30 shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto uppercase tracking-wide"
              >
                {isSummarizing ? <RefreshCw className="animate-spin" size={20}/> : <BrainCircuit size={20} />}
                {isSummarizing ? 'Analyzing...' : 'Generate Insights'}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#0B0415] p-8 rounded-3xl border border-white/10 min-h-[200px] text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium shadow-inner">
              {!aiSummary && !isSummarizing ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-slate-600">
                  <BrainCircuit size={48} className="mb-4 opacity-20" />
                  <p className="text-center max-w-sm">Ready to analyze your customer feedback. Click the button above to start.</p>
                </div>
              ) : isSummarizing ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6"></div>
                  <div className="h-4 bg-white/5 rounded w-2/3"></div>
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                </div>
              ) : aiSummary}
            </div>
            {aiSummary && (
              <button 
                onClick={copySummary}
                className="absolute top-4 right-4 bg-white/10 text-white p-2.5 rounded-xl hover:bg-white/20 transition-colors shadow-lg border border-white/5"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-cyan-400" /> : <Copy size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Charts Grid */}
      {metrics && metrics.totalReviews > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* New Trend Chart spans 2 cols on XL */}
            <div className="lg:col-span-2 xl:col-span-3">
                <PerformanceTrendChart reviews={reviews} />
            </div>
            <AverageProductRatingsChart data={metrics.averageProduct} />
            <AverageDeliveryRatingsChart data={metrics.averageDelivery} />
            {/* Placeholder for future chart or stats */}
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-6 rounded-2xl border border-cyan-500/20 text-white flex flex-col justify-center items-center text-center backdrop-blur-md">
                <Sparkles size={48} className="mb-4 text-cyan-400" />
                <h3 className="text-2xl font-black">{metrics.totalReviews}</h3>
                <p className="text-cyan-200 font-medium uppercase tracking-wider text-xs">Total Validated Reviews</p>
            </div>
        </div>
      )}

      {/* Review Table */}
      <div className="bg-[#1A1025]/60 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-black text-white tracking-wide uppercase">Review Stream</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Raw Customer Logs</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="relative group w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search comments or IDs..." 
                    className="w-full pl-11 pr-4 py-3 bg-[#0B0415] border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all shadow-sm placeholder:text-slate-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-black shrink-0 border border-white/5">
                {filteredReviews.length}
             </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="bg-[#0B0415] text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
              <tr>
                <th className="p-6">Customer Ref</th>
                <th className="p-6">Score</th>
                <th className="p-6">Delivery Details</th>
                <th className="p-6">Product Details</th>
                <th className="p-6 min-w-[300px]">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReviews.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-500 italic font-medium">No matching feedback found.</td></tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                        <span className="font-mono text-[11px] text-slate-400 font-bold tracking-tighter block">#{r.id}</span>
                        <span className="text-[10px] text-slate-500">{new Date(r.timestamp).toLocaleDateString()}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[#0B0415] text-lg ${r.deliveryRating.overall >= 4 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : r.deliveryRating.overall >= 2 ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'}`}>
                          {r.deliveryRating.overall}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-300 flex justify-between gap-4">Speed: <span className="text-cyan-400 font-mono">{r.deliveryRating.speed}/5</span></span>
                        <span className="text-xs font-bold text-slate-300 flex justify-between gap-4">Comms: <span className="text-cyan-400 font-mono">{r.deliveryRating.communication}/5</span></span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-300 flex justify-between gap-4">Quality: <span className="text-yellow-400 font-mono">{r.productRating.quality}/5</span></span>
                        <span className="text-xs font-bold text-slate-300 flex justify-between gap-4">Taste: <span className="text-yellow-400 font-mono">{r.productRating.taste}/5</span></span>
                      </div>
                    </td>
                    <td className="p-6">
                      {r.comment ? (
                        <div className="bg-[#0B0415] p-4 rounded-2xl border border-white/10 text-slate-400 leading-relaxed text-xs relative">
                          <span className="absolute top-2 left-2 text-white/10 text-4xl leading-none font-serif">"</span>
                          <p className="relative z-10 pl-2">{r.comment}</p>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs font-bold uppercase italic">No comment provided</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;