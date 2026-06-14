// ─── Admin Types ───────────────────────────────────────────────────────────────
// Paste into: src/types.ts (merge with existing) or keep as src/admin/types.ts

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price: number | null
  category_id: string | null
  image_url: string
  rating: number
  review_count: number
  is_featured: boolean
  key_type: string
  platform: string | null
  created_at: string
  categories?: Category
}

export interface Order {
  id: string
  user_id: string | null
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  subtotal: number
  processing_fee: number
  total: number
  customer_name: string
  customer_email: string
  customer_phone: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string
  quantity: number
  price: number
  created_at: string
}

export interface Profile {
  id: string
  full_name: string
  phone: string
  address: string
  city: string
  zip_code: string
  created_at: string
  updated_at: string
}
