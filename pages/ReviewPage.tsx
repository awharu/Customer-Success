import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import StarRating from '../components/StarRating';
import { CheckCircle, XCircle } from 'lucide-react';

const ReviewPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isUsed, setIsUsed] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [productRatings, setProductRatings] = useState({
    quality: 0,
    effects: 0,
    taste: 0,
    appearance: 0
  });
  const [deliveryRatings, setDeliveryRatings] = useState({
    speed: 0,
    communication: 0,
    overall: 0
  });
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (code) {
      const validation = db.validateCode(code);
      setIsValid(validation.valid);
      setIsUsed(validation.used);
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !isValid || isUsed) return;
    setSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      db.addReview({
        code,
        productRating: productRatings,
        deliveryRating: deliveryRatings,
        comment
      });
      setSubmitting(false);
      setIsUsed(true); // Switch to success view
    }, 1000);
  };

  const isFormComplete = 
    Object.values(productRatings).every((v) => (v as number) > 0) &&
    Object.values(deliveryRatings).every((v) => (v as number) > 0);

  // Loading State
  if (isValid === null) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Validating code...</div>;

  // Invalid Code View
  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <XCircle className="text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-slate-800">Invalid Code</h1>
        <p className="text-slate-600 mt-2">The review code provided is incorrect or does not exist.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-teal-600 hover:underline">Return Home</button>
      </div>
    );
  }

  // Used Code / Success View
  if (isUsed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <CheckCircle className="text-teal-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-slate-800">Thank You!</h1>
        <p className="text-slate-600 mt-2">Your feedback has been submitted successfully.</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
          View Live Metrics
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-teal-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Delivery Review</h1>
          <p className="opacity-90 mt-1">Share your experience anonymously.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          {/* Section 1: Product */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Product Evaluation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StarRating 
                label="Quality" 
                value={productRatings.quality} 
                onChange={(v) => setProductRatings(prev => ({...prev, quality: v}))} 
              />
              <StarRating 
                label="Effects" 
                value={productRatings.effects} 
                onChange={(v) => setProductRatings(prev => ({...prev, effects: v}))} 
              />
              <StarRating 
                label="Taste" 
                value={productRatings.taste} 
                onChange={(v) => setProductRatings(prev => ({...prev, taste: v}))} 
              />
              <StarRating 
                label="Appearance" 
                value={productRatings.appearance} 
                onChange={(v) => setProductRatings(prev => ({...prev, appearance: v}))} 
              />
            </div>
          </div>

          {/* Section 2: Delivery */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Delivery Service</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StarRating 
                label="Speed" 
                value={deliveryRatings.speed} 
                onChange={(v) => setDeliveryRatings(prev => ({...prev, speed: v}))} 
              />
              <StarRating 
                label="Communication" 
                value={deliveryRatings.communication} 
                onChange={(v) => setDeliveryRatings(prev => ({...prev, communication: v}))} 
              />
              <StarRating 
                label="Overall Experience" 
                value={deliveryRatings.overall} 
                onChange={(v) => setDeliveryRatings(prev => ({...prev, overall: v}))} 
              />
             </div>
          </div>

          {/* Section 3: Comments */}
          <div className="mb-8">
             <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Additional Comments</h2>
             <textarea 
               className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
               rows={4}
               placeholder="Optional comments about your experience..."
               value={comment}
               onChange={(e) => setComment(e.target.value)}
             />
          </div>

          <button 
            type="submit" 
            disabled={!isFormComplete || submitting}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              !isFormComplete || submitting 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Anonymous Review'}
          </button>
          
          {!isFormComplete && (
            <p className="text-xs text-center text-red-400 mt-2">Please rate all categories to continue.</p>
          )}

        </form>
      </div>
    </div>
  );
};

export default ReviewPage;