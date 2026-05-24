import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '../../context/NavigationContext';
import CartItem from './CartItem';

interface CartDrawerProps {
  onClose: () => void;
  onAuthRequired: () => void;
}

export default function CartDrawer({ onClose, onAuthRequired }: CartDrawerProps) {
  const { t } = useTranslation();
  const { items, totalPrice, totalItems } = useCart();
  const { navigate } = useNavigation();

  const handleCheckout = () => {
    onClose();
    navigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-slate-900 text-lg">{t('cart.title')}</h2>
            {totalItems > 0 && (
              <span className="bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-slate-700 font-semibold text-lg">{t('cart.empty')}</p>
              <p className="text-slate-400 text-sm mt-1">{t('cart.emptyDesc')}</p>
            </div>
            <button
              onClick={() => { onClose(); navigate('products'); }}
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
            >
              {t('cart.goToCatalog')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t border-slate-100 px-5 py-5 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('cart.subtotal')} ({totalItems} шт.)</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{t('cart.fee')}</span>
                  <span>{t('cart.free')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
                  <span>{t('cart.total')}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors"
              >
                {t('cart.checkout')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}