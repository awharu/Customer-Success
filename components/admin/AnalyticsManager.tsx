import React, { useState } from 'react';
import { aiService } from '../../services/ai';
import { Review, AggregatedMetrics } from '../../types';
import { Sparkles, RefreshCw, BrainCircuit, Copy, Check } from 'lucide-react';
import AverageProductRatingsChart from './charts/AverageProductRatingsChart';
import AverageDeliveryRatingsChart from './charts/AverageDeliveryRatingsChart';
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
  const { showToast } = useToast();

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
      <div className="bg-slate-900 p-1 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-teal-400 rotate-12"><BrainCircuit size={160} /></div>
        <div className="bg-slate-900 border border-slate-800 rounded-[2.4rem] p-10 relative z-10">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-teal-500/10 p-5 rounded-3xl border border-teal-500/20">
                <Sparkles className="text-teal-400" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">AI Feedback Analyst</h3>
                <p className="text-slate-400 font-medium mt-1">Transforming customer comments into strategic insights.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
              <div 
                className="flex items-center gap-3 cursor-pointer select-none bg-slate-800/50 px-5 py-3 rounded-2xl border border-slate-700 hover:border-teal-500/50 transition-all"
                onClick={() => setUseThinkingMode(!useThinkingMode)}
              >
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${useThinkingMode ? 'bg-teal-500' : 'bg-slate-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${useThinkingMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <div>
                  <label className="text-sm font-bold text-white cursor-pointer">Deep Analysis</label>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">More precise results</p>
                </div>
              </div>

              <button 
                onClick={generateSummary} 
                disabled={isSummarizing || reviews.length === 0} 
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-teal-50 disabled:opacity-30 transition-all shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                {isSummarizing ? <RefreshCw className="animate-spin" size={20}/> : <BrainCircuit size={20} />}
                {isSummarizing ? 'Analyzing Comments...' : 'Generate Insights'}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 min-h-[200px] text-slate-200 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {!aiSummary && !isSummarizing ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500">
                  <BrainCircuit size={48} className="mb-4 opacity-20" />
                  <p className="text-center max-w-sm">Ready to analyze your customer feedback. Click the button above to start.</p>
                </div>
              ) : isSummarizing ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                </div>
              ) : aiSummary}
            </div>
            {aiSummary && (
              <button 
                onClick={copySummary}
                className="absolute top-4 right-4 bg-slate-700 text-white p-2.5 rounded-xl hover:bg-slate-600 transition-colors shadow-lg"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-teal-400" /> : <Copy size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {metrics && metrics.totalReviews > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AverageProductRatingsChart data={metrics.averageProduct} />
          <AverageDeliveryRatingsChart data={metrics.averageDelivery} />
        </div>
      )}

      {/* Review Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Review Stream</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Raw Customer Logs</p>
          </div>
          <span className="bg-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black">
            {reviews.length} TOTAL
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b">
              <tr>
                <th className="p-6">Patient Ref</th>
                <th className="p-6">Sentiment</th>
                <th className="p-6">Delivery Details</th>
                <th className="p-6">Product Details</th>
                <th className="p-6 min-w-[300px]">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic font-medium">Awaiting first patient feedback.</td></tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 font-mono text-[11px] text-slate-400 font-bold tracking-tighter">#{r.id}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-lg ${r.deliveryRating.overall >= 4 ? 'bg-teal-500 shadow-teal-500/20' : r.deliveryRating.overall >= 2 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-red-500 shadow-red-500/20 shadow-lg'}`}>
                          {r.deliveryRating.overall}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 flex justify-between">Speed: <span className="text-slate-400">{r.deliveryRating.speed}</span></span>
                        <span className="text-xs font-bold text-slate-700 flex justify-between">Comms: <span className="text-slate-400">{r.deliveryRating.communication}</span></span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-700 flex justify-between">Quality: <span className="text-slate-400">{r.productRating.quality}</span></span>
                        <span className="text-xs font-bold text-slate-700 flex justify-between">Taste: <span className="text-slate-400">{r.productRating.taste}</span></span>
                      </div>
                    </td>
                    <td className="p-6">
                      {r.comment ? (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 italic leading-relaxed text-xs">
                          "{r.comment}"
                        </div>
                      ) : (
                        <span className="text-slate-200 text-xs font-bold uppercase italic">No comment provided</span>
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