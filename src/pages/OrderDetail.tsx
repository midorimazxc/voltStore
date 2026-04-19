import { ArrowLeft, Zap, Truck, Package, Clock, CheckCircle2, XCircle, MapPin } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useOrder } from '../hooks/useOrders';
import { OrderStatus, DeliveryType } from '../lib/types';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'confirmed', label: 'Order Confirmed' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' },
];

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const DELIVERY_ICONS: Record<DeliveryType, React.ReactNode> = {
  instant: <Zap className="w-4 h-4 text-cyan-500" />,
  express: <Truck className="w-4 h-4 text-blue-500" />,
  standard: <Package className="w-4 h-4 text-slate-500" />,
};

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const { navigate } = useNavigation();
  const { order, loading } = useOrder(orderId);

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
          <p className="text-slate-600">Order not found.</p>
          <button onClick={() => navigate('orders')} className="mt-4 text-cyan-600 hover:underline text-sm">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const eta = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            {DELIVERY_ICONS[order.delivery_type]}
            <span className="text-slate-700 capitalize">{order.delivery_type} Delivery</span>
          </div>
        </div>

        {order.delivery_type === 'instant' && !isCancelled && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm mb-1">
              <Zap className="w-4 h-4" />
              Instant Delivery Active
            </div>
            {eta && <p className="text-cyan-600 text-sm">Estimated arrival: <strong>{eta}</strong></p>}
          </div>
        )}

        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Delivery Progress</h2>
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-100" />
              <div className="space-y-5">
                {STEPS.map((step, i) => {
                  const stepIndex = STATUS_ORDER.indexOf(step.status);
                  const isComplete = currentStepIndex >= stepIndex;
                  const isCurrent = currentStepIndex === stepIndex;
                  return (
                    <div key={step.status} className="relative flex items-start gap-4 pl-10">
                      <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isComplete
                          ? 'bg-cyan-500 border-cyan-500'
                          : 'bg-white border-slate-200'
                      }`}>
                        {isComplete
                          ? <CheckCircle2 className="w-5 h-5 text-white" />
                          : <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                        }
                      </div>
                      <div className="pt-2">
                        <p className={`text-sm font-bold ${isComplete ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        {isCurrent && <p className="text-xs text-cyan-600 font-medium mt-0.5">Current status</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <div>
              <p className="text-rose-700 font-bold text-sm">Order Cancelled</p>
              <p className="text-rose-500 text-xs mt-0.5">This order has been cancelled.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Items Ordered</h2>
          <div className="divide-y divide-slate-100">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 text-sm font-semibold leading-tight">{item.product_name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="text-slate-900 font-bold text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 mt-2 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Delivery</span>
              <span>{order.delivery_fee === 0 ? 'Free' : `$${order.delivery_fee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-100">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            Delivery Address
          </h2>
          <p className="text-slate-700 font-semibold text-sm">{order.customer_name}</p>
          <p className="text-slate-500 text-sm mt-0.5">{order.delivery_address}</p>
          <p className="text-slate-500 text-sm">{order.delivery_city}, {order.delivery_zip}</p>
          {order.customer_phone && <p className="text-slate-400 text-sm mt-1">{order.customer_phone}</p>}
          {eta && order.delivery_type !== 'instant' && (
            <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              Estimated delivery: {eta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
