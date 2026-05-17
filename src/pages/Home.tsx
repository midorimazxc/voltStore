import { ArrowRight, Zap, Clock, Shield, Star, ChevronRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useFeaturedProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import { Smartphone, Laptop, Headphones, Tablet, Watch, Gamepad2 } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="w-7 h-7" />,
  laptop: <Laptop className="w-7 h-7" />,
  headphones: <Headphones className="w-7 h-7" />,
  tablet: <Tablet className="w-7 h-7" />,
  watch: <Watch className="w-7 h-7" />,
  'gamepad-2': <Gamepad2 className="w-7 h-7" />,
};

interface HomeProps {
  onAuthRequired: () => void;
}

export default function Home({ onAuthRequired }: HomeProps) {
  const { navigate } = useNavigation();
  const { products, loading } = useFeaturedProducts();
  const { categories } = useCategories();

  return (
    <div>
      <section className="relative bg-slate-900 overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              Мгновенная доставка — 2–4 часа
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              Будущее
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Электроники
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
              Покупайте новейшие смартфоны, ноутбуки, аудиотехнику и многое другое — с мгновенной доставкой прямо до вашей двери.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('products')}
                className="flex items-center gap-2 px-16 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all hover:scale-105"
              >
                Перейти в магазин
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-8 mt-14">
              {[
                { icon: <Clock className="w-5 h-5 text-cyan-400" />, label: 'Доставка 2-4 часа' },
                { icon: <Shield className="w-5 h-5 text-cyan-400" />, label: 'Гарантия 2 года' },
                { icon: <Star className="w-5 h-5 text-cyan-400" />, label: '50,000+ отзывов' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-slate-400 text-sm">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">Категории</h2>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-semibold transition-colors"
            >
              Показать все <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate('products')}
                className="flex flex-col items-center gap-3 p-4 bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-200 rounded-2xl transition-all group"
              >
                <div className="text-slate-600 group-hover:text-cyan-600 transition-colors">
                  {CATEGORY_ICONS[cat.icon] ?? <Smartphone className="w-7 h-7" />}
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-cyan-700 text-center">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <h3 className="text-white text-xl font-black">Мгновенная доставка</h3>
                <p className="text-slate-400 text-sm mt-0.5">Закажите до 18:00 и получите свой товар сегодня, всего за 2–4 часа.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { step: '1', label: 'Разместите' },
                { step: '2', label: 'Мы приготовим' },
                { step: '3', label: 'Доставка за пару часов' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                    {item.step}
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('products')}
              className="flex-shrink-0 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all"
            >
              Заказать сейчас
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Featured Products</h2>
              <p className="text-slate-500 mt-1">Hand-picked top sellers — all with instant delivery</p>
            </div>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-semibold transition-colors"
            >
              Показать все <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onAuthRequired={onAuthRequired} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}