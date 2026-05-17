import { ArrowLeft, ShoppingCart, Star, Zap, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import ReviewList from '../components/products/reviews/ReviewList';
import ReviewForm from '../components/products/reviews/ReviewForm';

interface ProductDetailProps {
  productId: string;
  onAuthRequired: () => void;
}

export default function ProductDetail({ productId, onAuthRequired }: ProductDetailProps) {
  const { navigate } = useNavigation();
  const { product, loading } = useProduct(productId);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { reviews, loading: reviewsLoading, addReview } = useReviews(productId);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!user) { onAuthRequired(); return; }
    addToCart(product!, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!user) { onAuthRequired(); return; }
    addToCart(product!, quantity);
    navigate('checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-white rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
              <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-slate-200 rounded-lg w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Товар не найден.</p>
          <button onClick={() => navigate('products')} className="mt-4 text-cyan-600 hover:underline">
            Назад к товарам
          </button>
        </div>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('products')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к товарам
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            {product.categories && (
              <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">
                {product.categories.name}
              </span>
            )}
            <h1 className="text-3xl font-black text-slate-900 mt-2 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-slate-600 text-sm font-medium">{product.rating}</span>
              <span className="text-slate-400 text-sm">({product.review_count.toLocaleString()} отзывов)</span>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-slate-400 line-through">${product.original_price.toFixed(2)}</span>
                  <span className="bg-rose-100 text-rose-600 text-sm font-bold px-2.5 py-1 rounded-lg">
                    Скидка {discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-5 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-700 font-semibold text-sm">
                <Zap className="w-4 h-4" />
                Мгновенная выдача ключа
              </div>
              <p className="text-cyan-600 text-sm mt-1">
                Ключ активации будет выдан <strong>сразу после оплаты</strong>.
              </p>
            </div>

            <p className="text-slate-600 mt-5 leading-relaxed text-sm">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">Количество</span>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? 'Добавлено!' : 'В корзину'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all"
              >
                <Zap className="w-5 h-5" />
                Купить сейчас
              </button>
            </div>

            <div className="flex gap-4 mt-5">
              {[
                { icon: <Zap className="w-4 h-4 text-cyan-500" />, text: 'Мгновенная выдача' },
                { icon: <Shield className="w-4 h-4 text-green-500" />, text: 'Гарантия качества' },
                { icon: <RotateCcw className="w-4 h-4 text-blue-500" />, text: 'Возврат за 30 дней' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-1.5 text-xs text-slate-500">
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900">
              Отзывы
              {reviews.length > 0 && (
                <span className="ml-2 text-base font-semibold text-slate-400">
                  ({reviews.length})
                </span>
              )}
            </h2>
          </div>

          <ReviewList reviews={reviews} loading={reviewsLoading} />

          <div className="mt-8">
            {user ? (
              <>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Оставить отзыв</h3>
                <ReviewForm onSubmit={addReview} />
              </>
            ) : (
              <p className="text-sm text-slate-400">
                <button
                  onClick={onAuthRequired}
                  className="text-cyan-600 font-semibold hover:underline"
                >
                  Войдите
                </button>
                , чтобы оставить отзыв.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}