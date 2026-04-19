import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, Product } from '../lib/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*, categories(*))')
      .eq('user_id', user.id);
    setItems((data as CartItem[]) ?? []);
    setLoading(false);
  };

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) return;
    const existing = items.find(i => i.product_id === product.id);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
      return;
    }
    const { data } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: product.id, quantity })
      .select('*, product:products(*, categories(*))')
      .single();
    if (data) setItems(prev => [...prev, data as CartItem]);
  };

  const removeFromCart = async (itemId: string) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
    setItems(prev => prev.map(i => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
