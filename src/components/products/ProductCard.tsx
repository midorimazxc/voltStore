import { Star, ShoppingCart, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

interface ProductCardProps {
  product: Product;
  onAuthRequired: () => void;
}

export default function ProductCard({ product, onAuthRequired }: ProductCardProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { onAuthRequired(); return; }
    addToCart(product);
  };

  return (
    <div
      onClick={() => navigate('product-detail', { productId: product.id })}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-50 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="flex items-center gap-1 bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            {t('product.instantDelivery')}
          </span>
          {discount && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {t('product.onlyLeft', { count: product.stock })}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {product.categories && (
          <span className="text-xs font-medium text-cyan-600 uppercase tracking-wide">
            {t(`products.categories.${product.categories.slug}`, { defaultValue: product.categories.name })}
          </span>
        )}
        <h3 className="text-slate-900 font-semibold mt-1 text-sm leading-tight line-clamp-2 group-hover:text-cyan-700 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.review_count.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="ml-2 text-xs text-slate-400 line-through">${product.original_price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {t('product.add')}
          </button>
        </div>
      </div>
    </div>
  );
}