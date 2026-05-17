import { ArrowRight, Zap, KeyRound, Shield, Star, ChevronRight, Gamepad2, Monitor, ShieldCheck } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useFeaturedProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  games: <Gamepad2 className="w-7 h-7" />,
  software: <Monitor className="w-7 h-7" />,
  antivirus: <ShieldCheck className="w-7 h-7" />,
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
      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        {/* Фоновое изображение — замени src на свою картинку */}
        <div className="absolute inset-0">
          <img
            src="/products/background.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          {/* Затемнение поверх картинки */}
          <div className="absolute inset-0 bg-slate-900/75" />
          {/* Градиент снизу для плавного перехода */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Декоративные блики */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              Мгновенная выдача ключей
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              Цифровые товары
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Мгновенно
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
              Игры, программы, антивирусы — ключи активации сразу после оплаты. Никаких ожиданий.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('products')}
                className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all hover:scale-105"
              >
                Перейти в магазин
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-8 mt-14">
              {[
                { icon: <KeyRound className="w-5 h-5 text-cyan-400" />, label: 'Ключ сразу после оплаты' },
                { icon: <Shield className="w-5 h-5 text-cyan-400" />, label: 'Гарантия подлинности' },
                { icon: <Star className="w-5 h-5 text-cyan-400" />, label: '50,000+ довольных клиентов' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-slate-300 text-sm">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">Категории</h2>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-semibold transition-colors"
            >
              Все товары <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate('products')}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-200 rounded-2xl transition-all group"
              >
                <div className="text-slate-600 group-hover:text-cyan-600 transition-colors">
                  {CATEGORY_ICONS[cat.slug] ?? <Gamepad2 className="w-7 h-7" />}
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-cyan-700 text-center">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Баннер — как это работает */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <h3 className="text-white text-xl font-black">Как это работает?</h3>
                <p className="text-slate-400 text-sm mt-0.5">
                  Выбери товар, оплати — и получи ключ мгновенно.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { step: '1', label: 'Выбери товар' },
                { step: '2', label: 'Оплати заказ' },
                { step: '3', label: 'Получи ключ' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
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
              Попробовать
            </button>
          </div>
        </div>
      </section>

      {/* Популярные товары */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Популярные товары</h2>
              <p className="text-slate-500 mt-1">Лучшие предложения — ключ сразу после оплаты</p>
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