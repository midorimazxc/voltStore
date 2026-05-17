export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category_id: string;
  image_url: string;
  stock: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  specs: Record<string, string>;
  created_at: string;
  categories?: Category;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export type DeliveryType = 'instant' | 'express' | 'standard';

export interface DeliveryOption {
  type: DeliveryType;
  label: string;
  description: string;
  fee: number;
  eta: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    type: 'instant',
    label: 'Instant Delivery',
    description: 'Delivered to your door today',
    fee: 14.99,
    eta: '2–4 hours',
  },
  {
    type: 'express',
    label: 'Express Delivery',
    description: 'Guaranteed next business day',
    fee: 4.99,
    eta: 'Next business day',
  },
  {
    type: 'standard',
    label: 'Standard Delivery',
    description: 'Free shipping on all orders',
    fee: 0,
    eta: '3–5 business days',
  },
];

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_type: DeliveryType;
  delivery_address: string;
  delivery_city: string;
  delivery_zip: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export type Page =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'checkout'
  | 'orders'
  | 'order-detail';

// Новый тип
export interface LicenseKey {
  id: string;
  product_id: string;
  key: string;
  is_used: boolean;
  order_id: string;
  used_at: string | null;
  created_at: string;
}

// Заменить OrderStatus — добавить 'paid'
export type OrderStatus = 'pending' | 'paid' | 'cancelled';

// Заменить весь интерфейс Order
export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  processing_fee: number;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  license_keys?: LicenseKey[];
}