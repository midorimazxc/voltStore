import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Copy, Check, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../context/NavigationContext';
import { useOrder } from '../hooks/useOrders';
import { LicenseKey } from '../lib/types';

interface OrderDetailProps {
  orderId: string;
}

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
          ? <><Check className="w-3.5 h-3.5 text-green-400" /> {t('orders.detail.copied')}</>
          : <><Copy className="w-3.5 h-3.5" /> {t('orders.detail.copy')}</>
        }
      </button>
    </div>
  );
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const { t, i18n } = useTranslation();
  const { navigate } = useNavigation();
  const { order, loading } = useOrder(orderId);

  const locale = i18n.language === 'en' ? 'en-US' : 'ru-RU';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">{t('orders.detail.notFound')}</p>
          <button
            onClick={() => navigate('orders')}
            className="mt-4 text-cyan-600 hover:underline text-sm"
          >
            {t('orders.backToOrders')}
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const isPaid = order.status === 'paid';
  const hasKeys = order.license_keys && order.license_keys.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button
          onClick={() => navigate('orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('orders.backToOrders')}
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">
            {t('orders.order')} #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date(order.created_at).toLocaleDateString(locale, {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </p>
        </div>

        {isPaid && !hasKeys && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <p className="text-amber-700 font-bold text-sm">{t('orders.detail.paidTitle')}</p>
            <p className="text-amber-600 text-xs mt-0.5">{t('orders.detail.paidDesc')}</p>
          </div>
        )}

        {isCancelled && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <div>
              <p className="text-rose-700 font-bold text-sm">{t('orders.detail.cancelledTitle')}</p>
              <p className="text-rose-500 text-xs mt-0.5">{t('orders.detail.cancelledDesc')}</p>
            </div>
          </div>
        )}

        {hasKeys && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h2 className="text-base font-bold text-slate-900">{t('orders.detail.activationKeys')}</h2>
            </div>
            <p className="text-slate-500 text-sm mb-4">{t('orders.detail.keysDesc')}</p>
            <div className="space-y-3">
              {order.license_keys!.map(lk => (
                <KeyCard key={lk.id} licenseKey={lk} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">{t('orders.detail.products')}</h2>
          <div className="divide-y divide-slate-100">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 text-sm font-semibold leading-tight">{item.product_name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{t('orders.detail.quantity')}: {item.quantity}</p>
                </div>
                <span className="text-slate-900 font-bold text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 mt-2 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>{t('orders.detail.subtotal')}</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>{t('orders.detail.fee')}</span>
              <span>{order.processing_fee === 0 ? t('orders.detail.free') : `$${order.processing_fee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-100">
              <span>{t('orders.detail.total')}</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-3">{t('orders.detail.contacts')}</h2>
          <p className="text-slate-700 font-semibold text-sm">{order.customer_name}</p>
          <p className="text-slate-500 text-sm">{order.customer_email}</p>
          {order.customer_phone && (
            <p className="text-slate-400 text-sm mt-0.5">{order.customer_phone}</p>
          )}
        </div>

      </div>
    </div>
  );
}