import React, { useState } from 'react';
import { aiService } from '../../services/ai';
import { Review } from '../../types';
import { Sparkles, RefreshCw, BrainCircuit } from 'lucide-react';

interface AnalyticsManagerProps {
  reviews: Review[];
}

const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ reviews }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);

  const generateSummary = async () => {
    setIsSummarizing(true);
    try {
      const summary = await aiService.summarizeReviews(reviews, useThinkingMode);
      setAiSummary(summary);
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
      setAiSummary("An error occurred while generating the summary. Please check your API configuration.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl border border-indigo-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit size={120} /></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/30 p-2 rounded-xl"><Sparkles className="text-indigo-200" size={24} /></div>
              <div>
                <h3 className="text-xl font-bold">AI Feedback Analyst</h3>
                <p className="text-xs text-indigo-300">Generates insights from customer comments.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setUseThinkingMode(!useThinkingMode)}>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${useThinkingMode ? 'bg-indigo-400' : 'bg-white/20'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${useThinkingMode ? 'translate-x-6' : 'translate-x-1'}`} /></div>
                <div>
                  <label htmlFor="deep-analysis-toggle" className="text-sm font-bold text-white cursor-pointer select-none">Deep Analysis</label>
                  <p className="text-[11px] text-indigo-300 group-hover:text-indigo-100 transition-colors">Slower, more thorough results.</p>
                </div>
              </div>
              <button onClick={generateSummary} disabled={isSummarizing || reviews.length === 0} className="bg-white text-indigo-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 disabled:opacity-30 transition-all shadow-lg flex items-center gap-2">
                {isSummarizing ? <><RefreshCw className="animate-spin" size={16}/> Analyzing...</> : 'Summarize Themes'}
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 min-h-[100px] text-indigo-50 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {aiSummary || (reviews.length === 0 ? "Wait for your first review to use AI analytics." : "Generate a report to see key themes across all customer comments.")}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b bg-slate-50"><h3 className="font-bold text-slate-800">Customer Review Logs</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b"><tr><th className="p-4">Ref ID</th><th className="p-4">Overall Score</th><th className="p-4">Delivery</th><th className="p-4">Product</th><th className="p-4 min-w-[300px]">Comments</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length === 0 ? (<tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No feedback received yet.</td></tr>) : (reviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-[10px] text-slate-400">#{r.id.substring(0,6)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold px-2 py-1 rounded text-white ${r.deliveryRating.overall >= 4 ? 'bg-green-500' : r.deliveryRating.overall >= 2 ? 'bg-amber-500' : 'bg-red-500'}`}>{r.deliveryRating.overall}</span>
                      <span className="text-slate-400">/5</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">S:{r.deliveryRating.speed} C:{r.deliveryRating.communication}</td>
                  <td className="p-4 text-slate-600 font-medium">Q:{r.productRating.quality} T:{r.productRating.taste}</td>
                  <td className="p-4 text-slate-700 italic">{r.comment ? <div className="bg-slate-100/50 p-2 rounded border border-slate-100 leading-snug">"{r.comment}"</div> : <span className="text-slate-300">-</span>}</td>
                </tr>))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;
