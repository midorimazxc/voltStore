import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CartItem as CartItemType } from '../../lib/types';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { t } = useTranslation();
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-900 text-sm font-semibold leading-tight line-clamp-2">{item.product.name}</p>
        <p className="text-slate-500 text-xs mt-0.5">${item.product.price.toFixed(2)} {t('cart.each')}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-900 text-sm font-bold">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}