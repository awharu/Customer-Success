import React, { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import StarRating from '../components/StarRating';
import { CheckCircle, XCircle, Loader2, ArrowRight, ArrowLeft, Package, Truck, MessageSquare, Check, Zap, AlertTriangle } from 'lucide-react';
import { ProductRating, DeliveryRating } from '../types';

type State = {
  status: 'validating' | 'invalid' | 'used' | 'form' | 'submitting' | 'success';
  step: number;
  productRatings: ProductRating;
  deliveryRatings: DeliveryRating;
  comment: string;
};

type Action =
  | { type: 'VALIDATE_SUCCESS' }
  | { type: 'VALIDATE_FAIL_INVALID' }
  | { type: 'VALIDATE_FAIL_USED' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'UPDATE_PRODUCT_RATING'; payload: Partial<ProductRating> }
  | { type: 'UPDATE_DELIVERY_RATING'; payload: Partial<DeliveryRating> }
  | { type: 'UPDATE_COMMENT'; payload: string };

const initialState: State = {
  status: 'validating',
  step: 1,
  productRatings: { quality: 0, effects: 0, taste: 0, weight: 0 },
  deliveryRatings: { speed: 0, communication: 0, overall: 0 },
  comment: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'VALIDATE_SUCCESS':
      return { ...state, status: 'form' };
    case 'VALIDATE_FAIL_INVALID':
      return { ...state, status: 'invalid' };
    case 'VALIDATE_FAIL_USED':
      return { ...state, status: 'used' };
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 3) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'SUBMIT':
      return { ...state, status: 'submitting' };
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'success' };
    case 'UPDATE_PRODUCT_RATING':
      return { ...state, productRatings: { ...state.productRatings, ...action.payload } };
    case 'UPDATE_DELIVERY_RATING':
      return { ...state, deliveryRatings: { ...state.deliveryRatings, ...action.payload } };
    case 'UPDATE_COMMENT':
      return { ...state, comment: action.payload };
    default:
      return state;
  }
}

const ReviewPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { status, step, productRatings, deliveryRatings, comment } = state;

  useEffect(() => {
    if (code) {
      // Normalize to uppercase to prevent case-sensitivity issues on mobile keyboards
      const normalizedCode = code.toUpperCase();
      const { valid, used } = db.validateCode(normalizedCode);
      
      if (!valid) {
        dispatch({ type: 'VALIDATE_FAIL_INVALID' });
      } else if (used) {
        dispatch({ type: 'VALIDATE_FAIL_USED' });
      } else {
        dispatch({ type: 'VALIDATE_SUCCESS' });
      }
    } else {
      dispatch({ type: 'VALIDATE_FAIL_INVALID' });
    }
  }, [code]);

  const handleSubmit = () => {
    if (!code || status !== 'form') return;
    dispatch({ type: 'SUBMIT' });

    setTimeout(() => {
      db.addReview({
        code: code.toUpperCase(),
        productRating: productRatings,
        deliveryRating: deliveryRatings,
        comment,
      });
      dispatch({ type: 'SUBMIT_SUCCESS' });
    }, 800);
  };

  const isStep1Complete = Object.values(productRatings).every(v => Number(v) > 0);
  const isStep2Complete = Object.values(deliveryRatings).every(v => Number(v) > 0);

  if (status === 'validating') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0415]">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
        <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs animate-pulse">Establishing Secure Uplink...</span>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0415] p-6 text-center">
        <div className="bg-red-500/10 p-8 rounded-full mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <XCircle className="text-red-500" size={48} />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Link Expired</h1>
        <p className="text-slate-400 max-w-xs leading-relaxed mb-8">
          This review link is either invalid or has already been processed by the mainframe.
        </p>
        
        <div className="max-w-xs mx-auto bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-xl mb-12 flex gap-3 text-left">
          <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
          <div>
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wide mb-1">Demo Environment</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This demo uses Local Storage. If you opened this link on a different device than where it was generated, it will not work because the databases are not synced.
            </p>
          </div>
        </div>

        <button onClick={() => navigate('/')} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest border border-white/10 px-8 py-4 rounded-full hover:bg-white/5 transition-all">
          Return to Hub
        </button>
      </div>
    );
  }

  if (status === 'used' || status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0415] p-6 text-center animate-in fade-in duration-700">
        <div className="bg-green-500/10 p-8 rounded-full mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <CheckCircle className="text-green-400" size={64} />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Transmission Complete</h1>
        <p className="text-slate-400 max-w-sm leading-relaxed mb-12">
          Your feedback has been encrypted and successfully committed to the anonymous ledger.
        </p>
        <button 
            onClick={() => navigate('/')} 
            className="bg-white text-[#0B0415] px-10 py-5 rounded-2xl font-black hover:bg-cyan-400 hover:text-black transition-all shadow-xl active:scale-95 uppercase tracking-wide"
        >
          View Live Metrics
        </button>
      </div>
    );
  }

  const renderProgressBar = () => (
    <div className="relative mb-12 px-4">
        {/* Connecting Lines */}
        <div className="absolute top-5 left-0 w-full px-12 box-border">
            <div className="w-full h-1 bg-white/10 rounded-full">
                 <div 
                    className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-700 ease-in-out rounded-full"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
            </div>
        </div>

        {/* Steps */}
        <div className="relative flex justify-between items-start">
            {[
                { id: 1, label: 'Quality', icon: Package },
                { id: 2, label: 'Delivery', icon: Truck },
                { id: 3, label: 'Feedback', icon: MessageSquare }
            ].map((s) => {
                const isActive = step >= s.id;
                const isCompleted = step > s.id;
                
                return (
                    <div key={s.id} className="flex flex-col items-center gap-3 z-10 group cursor-default">
                        <div 
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-out
                                ${isActive 
                                    ? 'bg-[#0B0415] border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-110' 
                                    : 'bg-[#0B0415] border-white/10 text-slate-600'
                                }
                            `}
                        >
                            {isCompleted ? <Check size={18} strokeWidth={3} /> : <s.icon size={18} />}
                        </div>
                        <span 
                            className={`
                                text-[10px] font-black uppercase tracking-widest transition-all duration-500
                                ${isActive ? 'text-cyan-400 translate-y-0 opacity-100 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-slate-600 translate-y-1 opacity-50'}
                            `}
                        >
                            {s.label}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0415] py-8 px-4 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0B0415] to-[#0B0415]">
      <div className="max-w-xl w-full bg-[#1A1025]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden border border-white/10 flex flex-col min-h-[650px]">
        {/* Header */}
        <div className="bg-[#0f0518] p-8 text-white relative overflow-hidden shrink-0 border-b border-white/5">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap size={100} />
            </div>
            <h1 className="text-2xl font-black relative z-10 uppercase tracking-wide flex items-center gap-3">
                <span className="w-2 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
                Anonymous Review
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 relative z-10 pl-5">Encrypted Connection</p>
        </div>

        <div className="flex-1 p-8 flex flex-col">
            {renderProgressBar()}

            <div className="flex-1 relative">
                <div key={step} className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out fill-mode-forwards">
                    {/* Step 1: Product */}
                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-yellow-400/10 p-4 rounded-2xl text-yellow-400 border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                                    <Package size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-wide">Product Quality</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Rate the items received</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-y-4">
                                <StarRating size={32} label="Quality" value={productRatings.quality} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { quality: v } })} />
                                <StarRating size={32} label="Effects" value={productRatings.effects} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { effects: v } })} />
                                <StarRating size={32} label="Taste" value={productRatings.taste} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { taste: v } })} />
                                <StarRating size={32} label="Weight" value={productRatings.weight} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { weight: v } })} />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Delivery */}
                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-blue-400/10 p-4 rounded-2xl text-blue-400 border border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.1)]">
                                    <Truck size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-wide">Logistics</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Rate the delivery service</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-y-6">
                                <StarRating size={32} label="Speed" value={deliveryRatings.speed} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { speed: v } })} />
                                <StarRating size={32} label="Communication" value={deliveryRatings.communication} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { communication: v } })} />
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <StarRating size={32} label="Overall Satisfaction" value={deliveryRatings.overall} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { overall: v } })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Comment */}
                    {step === 3 && (
                        <div className="space-y-8">
                             <div className="flex items-center gap-4 mb-8">
                                <div className="bg-purple-400/10 p-4 rounded-2xl text-purple-400 border border-purple-400/20 shadow-[0_0_15px_rgba(192,132,252,0.1)]">
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-wide">Final Thoughts</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Encrypted Comment Channel</p>
                                </div>
                            </div>
                            <textarea
                                className="w-full bg-[#0B0415] border border-white/10 rounded-2xl p-6 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-600 min-h-[200px] text-white resize-none font-medium leading-relaxed"
                                placeholder="Share your experience (Optional)..."
                                value={comment}
                                onChange={(e) => dispatch({ type: 'UPDATE_COMMENT', payload: e.target.value })}
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="pt-8 mt-4 border-t border-white/5 flex gap-4 shrink-0">
                {step > 1 && (
                    <button 
                        onClick={() => dispatch({ type: 'PREV_STEP' })}
                        className="px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}
                
                {step < 3 ? (
                    <button 
                        onClick={() => dispatch({ type: 'NEXT_STEP' })}
                        disabled={(step === 1 && !isStep1Complete) || (step === 2 && !isStep2Complete)}
                        className="flex-1 bg-white text-black py-4 rounded-2xl font-black hover:bg-cyan-400 transition-all disabled:bg-white/10 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] uppercase tracking-wide"
                    >
                        Next Step <ArrowRight size={20} strokeWidth={3} />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={status === 'submitting'}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-black hover:from-green-400 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-[0.98] uppercase tracking-wide"
                    >
                        {status === 'submitting' ? <Loader2 className="animate-spin" size={20} /> : 'Submit Review'}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;