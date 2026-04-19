import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../lib/types';
import { useAuth } from '../context/AuthContext';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  return { orders, loading };
}

export function useOrder(id: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setOrder(data as Order | null);
        setLoading(false);
      });
  }, [id]);

  return { order, loading };
}
