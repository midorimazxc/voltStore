import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, onRate, size = 'md' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} transition-colors ${
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
          } ${onRate ? 'cursor-pointer hover:text-amber-400' : ''}`}
          onClick={() => onRate?.(i + 1)}
        />
      ))}
    </div>
  );
}