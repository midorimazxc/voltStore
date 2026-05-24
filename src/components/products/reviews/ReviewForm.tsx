import { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { setError(t('reviews.ratingRequired')); return; }
    setError('');
    setLoading(true);
    try {
      await onSubmit(rating, comment.trim());
      setSuccess(true);
      setRating(0);
      setComment('');
    } catch {
      setError(t('reviews.submitError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-green-700">{t('reviews.thanks')}</p>
        <button onClick={() => setSuccess(false)} className="mt-2 text-xs text-green-600 underline">
          {t('reviews.writeAnother')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div>
        <p className="text-xs text-slate-500 mb-1.5">{t('reviews.yourRating')}</p>
        <StarRating rating={rating} onRate={setRating} />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1.5">{t('reviews.comment')}</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('reviews.commentPlaceholder')}
          rows={3}
          className="w-full text-sm text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-300 placeholder:text-slate-400"
        />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
        {loading ? t('reviews.submitting') : t('reviews.submit')}
      </button>
    </div>
  );
}