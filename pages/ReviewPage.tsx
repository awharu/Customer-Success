import React, { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import StarRating from '../components/StarRating';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ProductRating, DeliveryRating } from '../types';

type State = {
  status: 'validating' | 'invalid' | 'used' | 'form' | 'submitting' | 'success';
  productRatings: ProductRating;
  deliveryRatings: DeliveryRating;
  comment: string;
};

type Action =
  | { type: 'VALIDATE_SUCCESS' }
  | { type: 'VALIDATE_FAIL_INVALID' }
  | { type: 'VALIDATE_FAIL_USED' }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'UPDATE_PRODUCT_RATING'; payload: Partial<ProductRating> }
  | { type: 'UPDATE_DELIVERY_RATING'; payload: Partial<DeliveryRating> }
  | { type: 'UPDATE_COMMENT'; payload: string };

const initialState: State = {
  status: 'validating',
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
  const { status, productRatings, deliveryRatings, comment } = state;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  // FIX: Operator '>' cannot be applied to types 'unknown' and 'number'.
  // Explicitly convert values to numbers before comparison.
  // Object.values() can return `unknown[]` in some TypeScript configurations,
  // so `v` must be cast to a number to be used in a comparison.
  const isFormComplete =
    Object.values(productRatings).every(v => Number(v) > 0) &&
    Object.values(deliveryRatings).every(v => Number(v) > 0);

  if (status === 'validating') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600 mb-2" size={32} />
        <span className="text-slate-500 font-medium">Verifying code...</span>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <XCircle className="text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
        <p className="text-slate-600 mt-2 max-w-xs">The review link is invalid or has expired. Please contact support if you believe this is an error.</p>
        <button onClick={() => navigate('/')} className="mt-8 bg-white border border-slate-200 px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm">
          Return Home
        </button>
      </div>
    );
  }

  if (status === 'used' || status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="bg-teal-100 p-4 rounded-full mb-6">
          <CheckCircle className="text-teal-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Feedback Received</h1>
        <p className="text-slate-600 mt-2">Thank you for helping us improve our pharmacy services.</p>
        <button onClick={() => navigate('/')} className="mt-8 bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
          View Quality Metrics
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-teal-600 p-8 text-white">
          <h1 className="text-2xl font-bold">Delivery Review</h1>
          <p className="opacity-90 mt-1">Your feedback is 100% anonymous and secure.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-10">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-8 h-px bg-slate-200"></span> Product Evaluation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <StarRating label="Quality" value={productRatings.quality} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { quality: v } })} />
              <StarRating label="Effects" value={productRatings.effects} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { effects: v } })} />
              <StarRating label="Taste" value={productRatings.taste} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { taste: v } })} />
              <StarRating label="Appearance" value={productRatings.appearance} onChange={(v) => dispatch({ type: 'UPDATE_PRODUCT_RATING', payload: { appearance: v } })} />
            </div>
          </div>
          <div className="mb-10">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-8 h-px bg-slate-200"></span> Delivery Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <StarRating label="Speed" value={deliveryRatings.speed} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { speed: v } })} />
              <StarRating label="Communication" value={deliveryRatings.communication} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { communication: v } })} />
              <StarRating label="Overall Experience" value={deliveryRatings.overall} onChange={(v) => dispatch({ type: 'UPDATE_DELIVERY_RATING', payload: { overall: v } })} />
            </div>
          </div>
          <div className="mb-10">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-8 h-px bg-slate-200"></span> Additional Comments</h2>
            <textarea
              className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-slate-300 min-h-[120px]"
              placeholder="Tell us more about your experience (optional)..."
              value={comment}
              onChange={(e) => dispatch({ type: 'UPDATE_COMMENT', payload: e.target.value })}
            />
          </div>
          <button type="submit" disabled={!isFormComplete || status === 'submitting'} className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${!isFormComplete || status === 'submitting' ? 'bg-slate-200 cursor-not-allowed text-slate-400' : 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/20'}`}>
            {status === 'submitting' ? (<><Loader2 className="animate-spin" size={20} /> Processing...</>) : ('Submit Anonymous Review')}
          </button>
          {!isFormComplete && status !== 'submitting' && (<p className="text-xs text-center text-slate-400 mt-4">Please provide a rating for all categories to submit.</p>)}
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;