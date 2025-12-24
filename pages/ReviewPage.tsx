import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import StarRating from '../components/StarRating';
import { CheckCircle, XCircle, Loader2, ArrowRight, ArrowLeft, Package, Truck, MessageSquare } from 'lucide-react';
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
  productRatings: { quality: 0, effects: 0, taste: 0, appearance: 0 },
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
      const { valid, used } = db.validateCode(code);
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
        code,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600 mb-2" size={32} />
        <span className="text-slate-500 font-medium">Verifying secure link...</span>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-red-100 p-6 rounded-full mb-6">
            <XCircle className="text-red-500" size={48} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Link Expired</h1>
        <p className="text-slate-500 max-w-xs leading-relaxed">
          This review link is either invalid or has already been processed.
        </p>
        <button onClick={() => navigate('/')} className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
          Return Home
        </button>
      </div>
    );
  }

  if (status === 'used' || status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center animate-in fade-in duration-700">
        <div className="bg-teal-100 p-6 rounded-full mb-6 shadow-xl shadow-teal-100">
          <CheckCircle className="text-teal-600" size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Review Submitted</h1>
        <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
          Your feedback has been securely encrypted and anonymously added to our quality metrics.
        </p>
        <button 
            onClick={() => navigate('/')} 
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl active:scale-95"
        >
          See Live Metrics
        </button>
      </div>
    );
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2 px-1">
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= 1 ? 'text-teal-600' : 'text-slate-300'}`}>Product</span>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= 2 ? 'text-teal-600' : 'text-slate-300'}`}>Delivery</span>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= 3 ? 'text-teal-600' : 'text-slate-300'}`}>Comment</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
            className="h-full bg-teal-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col min-h-[600px]">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Package size={120} />
            </div>
            <h1 className="text-2xl font-black relative z-10">Anonymous Review</h1>
            <p className="text-slate-400 text-sm font-medium mt-1 relative z-10">Help us improve safely and securely.</p>
        </div>

        <div className="flex-1 p-8 flex flex-col">
            {renderProgressBar()}

            <div className="flex-1">
                {/* Step 1: Product */}
                {step === 1 && (
                    <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-teal-50 p-3 rounded-2xl text-teal-600">
                                <Package size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Product Quality</h2>
                                <p className="text-xs text-slate-400">Rate the items you received</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-2">
                            <StarRating size={32} label="Quality" value={productRatings.quality} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { quality: v } })} />
                            <StarRating size={32} label="Effects" value={productRatings.effects} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { effects: v } })} />
                            <StarRating size={32} label="Taste" value={productRatings.taste} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { taste: v } })} />
                            <StarRating size={32} label="Appearance" value={productRatings.appearance} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { appearance: v } })} />
                        </div>
                    </div>
                )}

                {/* Step 2: Delivery */}
                {step === 2 && (
                    <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Delivery Experience</h2>
                                <p className="text-xs text-slate-400">Rate the logistics service</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-4">
                            <StarRating size={32} label="Speed" value={deliveryRatings.speed} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { speed: v } })} />
                            <StarRating size={32} label="Communication" value={deliveryRatings.communication} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { communication: v } })} />
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <StarRating size={32} label="Overall Satisfaction" value={deliveryRatings.overall} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { overall: v } })} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Comment */}
                {step === 3 && (
                    <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-6">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Final Thoughts</h2>
                                <p className="text-xs text-slate-400">Optional feedback</p>
                            </div>
                        </div>
                        <textarea
                            className="w-full border-2 border-slate-100 rounded-2xl p-5 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-300 min-h-[160px] text-slate-700 resize-none font-medium"
                            placeholder="Tell us more about your experience..."
                            value={comment}
                            onChange={(e) => dispatch({ type: 'UPDATE_COMMENT', payload: e.target.value })}
                            autoFocus
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="pt-8 mt-4 border-t border-slate-50 flex gap-4">
                {step > 1 && (
                    <button 
                        onClick={() => dispatch({ type: 'PREV_STEP' })}
                        className="px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}
                
                {step < 3 ? (
                    <button 
                        onClick={() => dispatch({ type: 'NEXT_STEP' })}
                        disabled={(step === 1 && !isStep1Complete) || (step === 2 && !isStep2Complete)}
                        className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
                    >
                        Next Step <ArrowRight size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={status === 'submitting'}
                        className="flex-1 bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-600/20 active:scale-[0.98]"
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