import { useState } from 'react';
import { ArrowLeft, CreditCard, CheckCircle2, KeyRound, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LicenseKey } from '../lib/types';

function KeyCard({ licenseKey }: { licenseKey: LicenseKey }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <KeyRound className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <code className="text-cyan-300 text-sm font-mono tracking-wider truncate">
          {licenseKey.key}
        </code>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex-shrink-0"
      >
        {copied
          ? <><Check className="w-3.5 h-3.5 text-green-400" />{t('checkout.copied')}</>
          : <><Copy className="w-3.5 h-3.5" />{t('checkout.copy')}</>
        }
      </button>
    </div>
  );
}

interface SuccessState {
  orderId: string;
  keys: LicenseKey[];
}

export default function Checkout() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: user?.email ?? '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SuccessState | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    setLoading(true);
    setError('');

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'paid',
        subtotal: totalPrice,
        processing_fee: 0,
        total: totalPrice,
        customer_name: form.fullName,
        customer_email: form.email,
        customer_phone: form.phone,
      })
      .select()
      .single();

    if (orderErr || !order) {
      setError(t('checkout.orderError'));
      setLoading(false);
      return;
    }

    await supabase.from('order_items').insert(
      items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
      }))
    );

    const assignedKeys: LicenseKey[] = [];
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        const { data, error: keyErr } = await supabase
          .rpc('assign_license_key', {
            p_order_id: order.id,
            p_product_id: item.product_id,
          });

        if (keyErr) {
          console.error('Key not found for', item.product.name, keyErr.message);
          continue;
        }

        assignedKeys.push({
          id: crypto.randomUUID(),
          product_id: item.product_id,
          key: data as string,
          is_used: true,
          order_id: order.id,
          used_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      }
    }
    
    if (assignedKeys.length > 0) {
      const { error: mailErr } = await supabase.functions.invoke('send-key', {
        body: JSON.stringify({          // ← важно: строка, а не объект
          email: form.email,
          customerName: form.fullName,
          orderId: order.id,
          keys: assignedKeys.map(k => k.key),
        }),
      });
      if (mailErr) {
        console.error('Письмо не отправлено:', mailErr.message);
        // не блокируем пользователя — заказ уже создан
      }
    }

    await clearCart();
    setSuccess({ orderId: order.id, keys: assignedKeys });
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{t('checkout.successTitle')}</h2>
            <p className="text-slate-400 text-sm mt-1">
              {t('checkout.successOrder', { id: success.orderId.slice(0, 8).toUpperCase() })}
            </p>
          </div>

          {success.keys.length > 0 ? (
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">
                {t('checkout.yourKeys')}
              </p>
              <div className="space-y-3">
                {success.keys.map(lk => (
                  <KeyCard key={lk.id} licenseKey={lk} />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                {t('checkout.keysSaved')}
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-700 text-sm font-semibold">{t('checkout.keysForming')}</p>
              <p className="text-amber-600 text-xs mt-1">
                {t('checkout.keysFormingDesc')}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate('order-detail', { orderId: success.orderId })}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-sm"
            >
              {t('checkout.orderDetails')}
            </button>
            <button
              onClick={() => navigate('products')}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
            >
              {t('checkout.continueShopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg">{t('checkout.emptyCart')}</p>
          <button onClick={() => navigate('products')} className="mt-4 text-cyan-600 hover:underline text-sm">
            {t('checkout.goToCatalog')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('products')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('checkout.backToShopping')}
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-500" />
                {t('checkout.contacts')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: t('checkout.name'), key: 'fullName', type: 'text', placeholder: t('checkout.namePlaceholder'), colSpan: 'sm:col-span-2' },
                  { label: t('checkout.email'), key: 'email', type: 'email', placeholder: 'you@example.com' },
                  { label: t('checkout.phone'), key: 'phone', type: 'tel', placeholder: t('checkout.phonePlaceholder') },
                ].map(field => (
                  <div key={field.key} className={field.colSpan}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-5">{t('checkout.orderSummary')}</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-xs font-semibold line-clamp-2 leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">x{item.quantity}</p>
                    </div>
                    <span className="text-slate-900 text-sm font-bold flex-shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('checkout.subtotal')}</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('checkout.fee')}</span>
                  <span className="font-semibold">{t('checkout.free')}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-100">
                  <span>{t('checkout.total')}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full py-4 bg-slate-900 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
              >
                {loading ? t('checkout.processing') : t('checkout.pay', { amount: totalPrice.toFixed(2) })}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3">
                {t('checkout.demo')}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
