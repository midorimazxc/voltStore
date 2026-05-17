import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import { Smartphone, Laptop, Headphones, Tablet, Watch, Gamepad2 } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="w-4 h-4" />,
  laptop: <Laptop className="w-4 h-4" />,
  headphones: <Headphones className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
  watch: <Watch className="w-4 h-4" />,
  'gamepad-2': <Gamepad2 className="w-4 h-4" />,
};

interface ProductsProps {
  onAuthRequired: () => void;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Популярные' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'rating', label: 'По рейтингу' },
];

export default function Products({ onAuthRequired }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState('featured');
  const { categories } = useCategories();
  const { products, loading } = useProducts(activeCategory, search);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white mb-6">Все товары</h1>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setSearch(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-xl transition-colors text-sm"
            >
              Найти
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Все
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {CATEGORY_ICONS[cat.icon]}
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {loading ? 'Загрузка...' : `Найдено товаров: ${sortedProducts.length}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Товары не найдены.</p>
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setActiveCategory('all'); }}
              className="mt-4 text-cyan-600 hover:underline text-sm"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} onAuthRequired={onAuthRequired} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}