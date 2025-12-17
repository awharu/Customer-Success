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
      {label && <span className="text-sm font-medium text-slate-700 mb-1">{label}</span>}
      <div className="flex items-center gap-1">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange && onChange(star)}
            className={`transition-colors duration-200 focus:outline-none ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              size={size}
              fill={star <= value ? "#fbbf24" : "none"} // amber-400
              className={star <= value ? "text-amber-400" : "text-slate-300"}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;