import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../lib/types';

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    const list = data || [];
    setReviews(list);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserReview(list.find((r) => r.user_id === user.id) ?? null);
    }
    setLoading(false);
  }

  async function addReview(rating: number, comment: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    });

    if (error) throw error;
    await fetchReviews();
  }

  return { reviews, loading, userReview, addReview };
}