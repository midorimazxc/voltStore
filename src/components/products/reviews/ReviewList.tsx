import { useTranslation } from 'react-i18next';
import { Review } from '../../../lib/types';
import StarRating from './StarRating';

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  const { t, i18n } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-200" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded mb-1.5" />
            <div className="h-3 w-2/3 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-4">{t('reviews.noReviews')}</p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const name = review.profiles?.full_name || t('reviews.anonymous');
        const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        const date = new Date(review.created_at).toLocaleDateString(i18n.language === 'kz' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-RU', {
          day: 'numeric', month: 'long', year: 'numeric',
        });

        return (
          <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                <p className="text-xs text-slate-400">{date}</p>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            {review.comment && (
              <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
