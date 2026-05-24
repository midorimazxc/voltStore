import { ArrowRight, Zap, KeyRound, Shield, Star, ChevronRight, Gamepad2, Monitor, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { products, loading } = useFeaturedProducts();
  const { categories } = useCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/products/background.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              {t('home.badge')}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              {t('home.heroTitle')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {t('home.heroTitleAccent')}
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
              {t('home.heroDesc')}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('products')}
                className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all hover:scale-105"
              >
                {t('home.goToShop')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-8 mt-14">
              {[
                { icon: <KeyRound className="w-5 h-5 text-cyan-400" />, label: t('home.keyAfterPayment') },
                { icon: <Shield className="w-5 h-5 text-cyan-400" />, label: t('home.guarantee') },
                { icon: <Star className="w-5 h-5 text-cyan-400" />, label: t('home.happyClients') },
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

      {/* Categories */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">{t('home.categories')}</h2>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-semibold transition-colors"
            >
              {t('home.allProducts')} <ChevronRight className="w-4 h-4" />
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

      {/* How it works banner */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-7 h-7 text-slate-900" />
              </div>
              <div>
                <h3 className="text-white text-xl font-black">{t('home.howItWorks')}</h3>
                <p className="text-slate-400 text-sm mt-0.5">{t('home.howItWorksDesc')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              {(['1', '2', '3'] as const).map(step => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                    {step}
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{t(`home.steps.${step}`)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('products')}
              className="flex-shrink-0 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all"
            >
              {t('home.tryNow')}
            </button>
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{t('home.popular')}</h2>
              <p className="text-slate-500 mt-1">{t('home.popularDesc')}</p>
            </div>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-semibold transition-colors"
            >
              {t('home.showAll')} <ChevronRight className="w-4 h-4" />
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