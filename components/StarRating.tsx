import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
  label?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  readonly = false, 
  size = 24,
  label
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col mb-4">
      {label && <span className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">{label}</span>}
      <div className="flex items-center gap-2">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange && onChange(star)}
            className={`transition-all duration-300 focus:outline-none ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              size={size}
              fill={star <= value ? "#FAFF00" : "none"} // Neon Yellow fill
              className={`${
                star <= value 
                  ? "text-[#FAFF00] drop-shadow-[0_0_8px_rgba(250,255,0,0.6)]" 
                  : "text-slate-700"
              }`}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;