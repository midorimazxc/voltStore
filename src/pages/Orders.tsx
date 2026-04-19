import { ArrowLeft, Package, Zap, Truck, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useOrders } from '../hooks/useOrders';
import { Order, OrderStatus, DeliveryType } from '../lib/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  preparing: { label: 'Preparing', color: 'bg-violet-100 text-violet-700', icon: <Package className="w-3.5 h-3.5" /> },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-cyan-100 text-cyan-700', icon: <Truck className="w-3.5 h-3.5" /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700', icon: <XCircle className="w-3.5 h-3.5" /> },
};

const DELIVERY_LABELS: Record<DeliveryType, { label: string; icon: React.ReactNode }> = {
  instant: { label: 'Instant Delivery', icon: <Zap className="w-3.5 h-3.5 text-cyan-500" /> },
  express: { label: 'Express Delivery', icon: <Truck className="w-3.5 h-3.5 text-blue-500" /> },
  standard: { label: 'Standard Delivery', icon: <Package className="w-3.5 h-3.5 text-slate-500" /> },
};

function OrderCard({ order }: { order: Order }) {
  const { navigate } = useNavigation();
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const delivery = DELIVERY_LABELS[order.delivery_type] ?? DELIVERY_LABELS.standard;

  const eta = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div
      onClick={() => navigate('order-detail', { orderId: order.id })}
      className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-slate-900 font-bold mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          {delivery.icon}
          <span className="font-medium">{delivery.label}</span>
        </div>
        {eta && (
          <span className="text-xs text-slate-400">· ETA {eta}</span>
        )}
      </div>

      {order.order_items && order.order_items.length > 0 && (
        <div className="flex gap-2 mt-3">
          {order.order_items.slice(0, 4).map(item => (
            <div key={item.id} className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
            </div>
          ))}
          {order.order_items.length > 4 && (
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <span className="text-xs text-slate-500 font-bold">+{order.order_items.length - 4}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {order.order_items?.length ?? 0} item{(order.order_items?.length ?? 0) !== 1 ? 's' : ''}
        </span>
        <span className="text-slate-900 font-black">${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function Orders() {
  const { navigate } = useNavigation();
  const { orders, loading } = useOrders();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-slate-900 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-3xl font-black text-white">My Orders</h1>
          <p className="text-slate-400 text-sm mt-1">Track your purchases and delivery status</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-bold text-xl mb-2">No orders yet</h3>
            <p className="text-slate-400 text-sm mb-6">Your orders will appear here once you make a purchase.</p>
            <button
              onClick={() => navigate('products')}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
