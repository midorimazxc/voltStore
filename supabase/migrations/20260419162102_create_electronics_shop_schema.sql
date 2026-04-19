
/*
  # Electronics Shop Schema

  ## Overview
  Full e-commerce schema for an electronics product shop with instant delivery support.

  ## New Tables
  1. `categories` - Product categories (Phones, Laptops, Audio, etc.)
  2. `products` - Electronics products with pricing, stock, specs
  3. `profiles` - Extended user profile data (address, phone)
  4. `cart_items` - Per-user shopping cart items
  5. `orders` - Customer orders with delivery type (instant/express/standard)
  6. `order_items` - Line items for each order

  ## Security
  - RLS enabled on all tables
  - Public read on products/categories
  - Authenticated-only access to cart, orders, profiles

  ## Seed Data
  - 6 product categories
  - 18 electronics products with real descriptions and specs
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  category_id uuid REFERENCES categories(id),
  image_url text DEFAULT '',
  stock integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 4.5,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  specs jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  zip_code text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  delivery_type text NOT NULL DEFAULT 'standard',
  delivery_address text NOT NULL DEFAULT '',
  delivery_city text DEFAULT '',
  delivery_zip text DEFAULT '',
  customer_name text NOT NULL DEFAULT '',
  customer_email text NOT NULL DEFAULT '',
  customer_phone text DEFAULT '',
  estimated_delivery timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text DEFAULT '',
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Seed: Categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Smartphones', 'smartphones', 'smartphone'),
  ('Laptops', 'laptops', 'laptop'),
  ('Audio', 'audio', 'headphones'),
  ('Tablets', 'tablets', 'tablet'),
  ('Wearables', 'wearables', 'watch'),
  ('Gaming', 'gaming', 'gamepad-2')
ON CONFLICT (slug) DO NOTHING;

-- Seed: Products
INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'iPhone 15 Pro',
  'The most powerful iPhone ever with the A17 Pro chip, titanium design, and a customizable Action button. Experience pro-level photography with a 48MP main camera.',
  1199.00, 1299.00,
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
  42, 4.9, 2841, true,
  '{"Display": "6.1\" Super Retina XDR", "Chip": "A17 Pro", "Camera": "48MP Main + 12MP Ultra Wide", "Battery": "Up to 23h video", "Storage": "128GB – 1TB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPhone 15 Pro');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Samsung Galaxy S24 Ultra',
  'Meet the ultimate Galaxy AI smartphone. With a built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3, it redefines what a smartphone can do.',
  1299.00, 1399.00,
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800',
  35, 4.8, 1923, true,
  '{"Display": "6.8\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 3", "Camera": "200MP Main", "Battery": "5000mAh", "Storage": "256GB – 1TB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Samsung Galaxy S24 Ultra');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Google Pixel 8 Pro',
  'Google''s most advanced AI phone. With the Tensor G3 chip, pro-level camera system, and 7 years of guaranteed updates, this is the Android phone of the future.',
  999.00, 1099.00,
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=800',
  28, 4.7, 987, false,
  '{"Display": "6.7\" LTPO OLED", "Chip": "Tensor G3", "Camera": "50MP Main + 48MP Ultra Wide", "Battery": "5050mAh", "Storage": "128GB – 1TB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Google Pixel 8 Pro');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'MacBook Pro 14" M3',
  'The most powerful MacBook Pro ever. Featuring the M3 chip with up to 18 hours of battery life, a stunning Liquid Retina XDR display, and an advanced camera.',
  1999.00, 2199.00,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=800',
  20, 4.9, 3102, true,
  '{"Display": "14.2\" Liquid Retina XDR", "Chip": "Apple M3", "RAM": "8GB – 36GB", "Storage": "512GB – 8TB", "Battery": "Up to 18h"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'MacBook Pro 14" M3');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Dell XPS 15',
  'A premium Windows laptop with a stunning OLED display, Intel Core i9, dedicated NVIDIA graphics, and a sleek infinity-edge design perfect for creators.',
  1799.00, 1999.00,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
  15, 4.7, 1456, true,
  '{"Display": "15.6\" 3.5K OLED Touch", "CPU": "Intel Core i9-13900H", "RAM": "16GB – 64GB", "GPU": "NVIDIA RTX 4060", "Storage": "512GB – 4TB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dell XPS 15');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'ASUS ROG Zephyrus G14',
  'The ultimate gaming laptop. AMD Ryzen 9, GeForce RTX 4070, and a 165Hz QHD display packed into a surprisingly slim and light chassis.',
  1599.00, 1799.00,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
  18, 4.8, 892, false,
  '{"Display": "14\" QHD 165Hz", "CPU": "AMD Ryzen 9 7940HS", "RAM": "16GB DDR5", "GPU": "RTX 4070", "Storage": "1TB NVMe"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'ASUS ROG Zephyrus G14');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Sony WH-1000XM5',
  'Industry-leading noise cancellation meets exceptional sound quality. With 30 hours of battery life and multipoint connection, these are the world''s best headphones.',
  349.00, 399.00,
  (SELECT id FROM categories WHERE slug = 'audio'),
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
  60, 4.9, 4521, true,
  '{"Type": "Over-ear, Wireless", "ANC": "Industry-leading", "Battery": "30 hours", "Connectivity": "Bluetooth 5.2", "Driver": "30mm"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sony WH-1000XM5');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Apple AirPods Pro (2nd Gen)',
  'AirPods Pro with H2 chip deliver up to 2x more Active Noise Cancellation, plus Adaptive Transparency and Personalized Spatial Audio.',
  249.00, 279.00,
  (SELECT id FROM categories WHERE slug = 'audio'),
  'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=800',
  75, 4.8, 6234, true,
  '{"Type": "In-ear, True Wireless", "ANC": "Up to 2x stronger", "Battery": "6h + 30h case", "Chip": "Apple H2", "Water Resistance": "IPX4"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Apple AirPods Pro (2nd Gen)');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Bose QuietComfort 45',
  'Legendary Bose noise cancellation in a refined, lightweight design. Enjoy 24 hours of battery life with premium audio performance and all-day comfort.',
  279.00, 329.00,
  (SELECT id FROM categories WHERE slug = 'audio'),
  'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
  45, 4.7, 2341, false,
  '{"Type": "Over-ear, Wireless", "ANC": "World-class", "Battery": "24 hours", "Connectivity": "Bluetooth 5.1", "Weight": "238g"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bose QuietComfort 45');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'iPad Pro 12.9" M2',
  'The ultimate iPad experience. The M2 chip, Apple Pencil hover, ProMotion display, and Thunderbolt connectivity make this the most capable iPad ever made.',
  1099.00, 1199.00,
  (SELECT id FROM categories WHERE slug = 'tablets'),
  'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
  30, 4.9, 1876, true,
  '{"Display": "12.9\" Liquid Retina XDR", "Chip": "Apple M2", "Camera": "12MP + 10MP Ultra Wide", "Battery": "Up to 10h", "Storage": "128GB – 2TB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPad Pro 12.9" M2');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Samsung Galaxy Tab S9 Ultra',
  'The pinnacle of Android tablets. With a massive 14.6" Dynamic AMOLED display, S Pen included, and DeX mode, work and play like never before.',
  1199.00, 1299.00,
  (SELECT id FROM categories WHERE slug = 'tablets'),
  'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800',
  22, 4.8, 943, false,
  '{"Display": "14.6\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 2", "RAM": "12GB – 16GB", "Battery": "11200mAh", "S Pen": "Included"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Samsung Galaxy Tab S9 Ultra');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Apple Watch Series 9',
  'The most powerful Apple Watch. With the S9 SiP chip, Double Tap gesture, and brighter Always-On Retina display, it''s a leap forward in health and connectivity.',
  399.00, 429.00,
  (SELECT id FROM categories WHERE slug = 'wearables'),
  'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg?auto=compress&cs=tinysrgb&w=800',
  55, 4.8, 3421, true,
  '{"Display": "Always-On Retina LTPO", "Chip": "Apple S9 SiP", "Health": "ECG, Blood Oxygen, Crash Detection", "Battery": "Up to 18h", "Water": "50m resistant"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Apple Watch Series 9');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Samsung Galaxy Watch 6 Classic',
  'Elegance meets functionality. The iconic rotating bezel returns with advanced health monitoring, sleep coaching, and a stunning sapphire crystal display.',
  329.00, 379.00,
  (SELECT id FROM categories WHERE slug = 'wearables'),
  'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=800',
  40, 4.7, 1234, false,
  '{"Display": "1.47\" Super AMOLED", "Design": "Rotating Bezel", "Health": "BioActive Sensor, ECG", "Battery": "Up to 40h", "OS": "Wear OS + One UI Watch"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Samsung Galaxy Watch 6 Classic');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'PlayStation 5',
  'Experience lightning-fast loading, deeper immersion with haptic feedback, adaptive triggers, and 3D audio. This is the future of gaming.',
  499.00, 549.00,
  (SELECT id FROM categories WHERE slug = 'gaming'),
  'https://images.pexels.com/photos/2885578/pexels-photo-2885578.jpeg?auto=compress&cs=tinysrgb&w=800',
  12, 4.9, 8932, true,
  '{"CPU": "AMD Zen 2, 8-core 3.5GHz", "GPU": "10.3 TFLOPS RDNA 2", "RAM": "16GB GDDR6", "Storage": "825GB SSD", "Resolution": "Up to 8K"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PlayStation 5');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Xbox Series X',
  'The fastest, most powerful Xbox ever. Play thousands of titles across 4 generations with the all-new Xbox Velocity Architecture and Quick Resume.',
  499.00, 549.00,
  (SELECT id FROM categories WHERE slug = 'gaming'),
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
  10, 4.8, 6723, true,
  '{"CPU": "AMD Zen 2, 8-core 3.8GHz", "GPU": "12 TFLOPS RDNA 2", "RAM": "16GB GDDR6", "Storage": "1TB NVMe SSD", "Resolution": "Up to 8K"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Xbox Series X');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Nintendo Switch OLED',
  'Play at home or on the go with the Nintendo Switch OLED model, featuring a vibrant 7-inch OLED screen, a wide adjustable stand, and 64GB of internal storage.',
  349.00, 379.00,
  (SELECT id FROM categories WHERE slug = 'gaming'),
  'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=800',
  25, 4.8, 4512, false,
  '{"Display": "7\" OLED", "Storage": "64GB internal", "Battery": "4.5 – 9h", "TV Output": "1080p", "Handheld": "720p"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nintendo Switch OLED');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'Sony Alpha A7 IV',
  'A full-frame mirrorless camera with 33MP sensor, 4K60p video, 10fps continuous shooting, and advanced Real-time Tracking AI autofocus.',
  2499.00, 2699.00,
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800',
  8, 4.9, 1203, false,
  '{"Sensor": "33MP Full-Frame BSI CMOS", "Video": "4K60p, 10-bit", "AF": "759-point AI", "ISO": "100-51200", "Stabilization": "5.5-stop IBIS"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sony Alpha A7 IV');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, review_count, is_featured, specs)
SELECT
  'GoPro HERO12 Black',
  'The most powerful GoPro ever. Shoot stunning 5.3K video, 27MP photos, and stream live in HD. Waterproof to 33ft with HyperSmooth 6.0 stabilization.',
  399.00, 449.00,
  (SELECT id FROM categories WHERE slug = 'wearables'),
  'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800',
  33, 4.7, 2876, false,
  '{"Video": "5.3K60 / 4K120", "Photo": "27MP", "Stabilization": "HyperSmooth 6.0", "Waterproof": "33ft (10m)", "Battery": "Up to 70 min 5.3K"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'GoPro HERO12 Black');
