import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Product } from '../lib/types';

export function useProducts(categorySlug?: string, search?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, categories(*)')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (categorySlug && categorySlug !== 'all') {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .maybeSingle();
        if (cat) query = query.eq('category_id', cat.id);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data } = await query;
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [categorySlug, search]);

  return { products, loading };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_featured', true)
      .limit(8)
      .then(({ data }) => {
        setProducts((data as Product[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data as Product | null);
        setLoading(false);
      });
  }, [id]);

  return { product, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  return { categories };
}
