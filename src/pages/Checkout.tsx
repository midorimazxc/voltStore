import { useState } from 'react';
import { ArrowLeft, Zap, Clock, Truck, CheckCircle2, CreditCard } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { DELIVERY_OPTIONS, DeliveryType } from '../lib/types';

export default function Checkout() {
  const { navigate } = useNavigation();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [delivery, setDelivery] = useState<DeliveryType>('instant');
  const [form, setForm] = useState({
    fullName: '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const selectedDelivery = DELIVERY_OPTIONS.find(o => o.type === delivery)!;
  const total = totalPrice + selectedDelivery.fee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    setLoading(true);
    setError('');

    const etaHours = delivery === 'instant' ? 4 : delivery === 'express' ? 24 : 96;
    const estimatedDelivery = new Date(Date.now() + etaHours * 60 * 60 * 1000).toISOString();

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'confirmed',
        subtotal: totalPrice,
        delivery_fee: selectedDelivery.fee,
        total,
        delivery_type: delivery,
        delivery_address: form.address,
        delivery_city: form.city,
        delivery_zip: form.zip,
        customer_name: form.fullName,
        customer_email: form.email,
        customer_phone: form.phone,
        estimated_delivery: estimatedDelivery,
      })
      .select()
      .single();

    if (orderErr || !order) {
      setError('Failed to place order. Please try again.');
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

    await clearCart();
    setOrderId(order.id);
    setLoading(false);
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Order Placed!</h2>
          <p className="text-slate-500 text-sm mb-5">
            Your order has been confirmed. Order #{orderId.slice(0, 8).toUpperCase()}
          </p>

          {delivery === 'instant' && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-cyan-700 font-bold">
                <Zap className="w-5 h-5" />
                Instant Delivery Confirmed!
              </div>
              <p className="text-cyan-600 text-sm mt-2">
                Your order will arrive at your door in <strong>2–4 hours</strong>. Sit back and relax!
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate('orders')}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-sm"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('products')}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
            >
              Continue Shopping
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
          <p className="text-slate-600 text-lg">Your cart is empty.</p>
          <button onClick={() => navigate('products')} className="mt-4 text-cyan-600 hover:underline text-sm">
            Browse products
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
          Continue Shopping
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-500" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'John Smith', colSpan: 'sm:col-span-2' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                  { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
                ].map(field => (
                  <div key={field.key} className={field.colSpan}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
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

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Truck className="w-5 h-5 text-slate-500" />
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Street Address', key: 'address', placeholder: '123 Main St', colSpan: 'sm:col-span-2' },
                  { label: 'City', key: 'city', placeholder: 'New York' },
                  { label: 'ZIP Code', key: 'zip', placeholder: '10001' },
                ].map(field => (
                  <div key={field.key} className={field.colSpan}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                    <input
                      type="text"
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

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                Delivery Method
              </h2>
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map(option => (
                  <label
                    key={option.type}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      delivery === option.type
                        ? option.type === 'instant'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.type}
                      checked={delivery === option.type}
                      onChange={() => setDelivery(option.type)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      option.type === 'instant' ? 'bg-cyan-500' : 'bg-slate-200'
                    }`}>
                      {option.type === 'instant' ? (
                        <Zap className="w-5 h-5 text-slate-900" />
                      ) : (
                        <Truck className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{option.label}</span>
                        {option.type === 'instant' && (
                          <span className="bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{option.description}</p>
                      <p className="text-slate-700 text-xs font-semibold mt-1">
                        ETA: {option.eta}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-bold text-slate-900 text-sm">
                        {option.fee === 0 ? 'Free' : `$${option.fee.toFixed(2)}`}
                      </span>
                    </div>
                    {delivery === option.type && (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        option.type === 'instant' ? 'border-cyan-500 bg-cyan-500' : 'border-slate-900 bg-slate-900'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-xs font-semibold line-clamp-2 leading-tight">{item.product.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-slate-900 text-sm font-bold flex-shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery ({selectedDelivery.label})</span>
                  <span className="font-semibold">
                    {selectedDelivery.fee === 0 ? 'Free' : `$${selectedDelivery.fee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {delivery === 'instant' && (
                <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-cyan-700 font-semibold text-xs">
                    <Zap className="w-3.5 h-3.5" />
                    Instant Delivery — Arrives in 2–4 hours
                  </div>
                </div>
              )}

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
                {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3">
                Secure checkout. Demo — no real payment.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
