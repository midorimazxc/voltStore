import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AuthModal from './components/auth/AuthModal';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminPanel from './admin/AdminPanel'

function AppShell() {
  const { nav } = useNavigation();
  const { user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const ADMIN_EMAIL = 'saidbfh@email.com';  // ← admin email
  const isAdmin = user?.email === ADMIN_EMAIL;

  // ← если ты залогинен, ты админ и нажал кнопку "Админка" — рендерим админку
  if (isAdmin && showAdmin) {
    return <AdminPanel onExit={() => setShowAdmin(false)} />;
  }

  const openAuth = () => setAuthOpen(true);

  const renderPage = () => {
    switch (nav.page) {
      case 'home':
        return <Home onAuthRequired={openAuth} />;
      case 'products':
        return <Products onAuthRequired={openAuth} />;
      case 'product-detail':
        return nav.productId
          ? <ProductDetail productId={nav.productId} onAuthRequired={openAuth} />
          : <Products onAuthRequired={openAuth} />;
      case 'checkout':
        return <Checkout />;
      case 'orders':
        return <Orders />;
      case 'order-detail':
        return nav.orderId
          ? <OrderDetail orderId={nav.orderId} />
          : <Orders />;
      default:
        return <Home onAuthRequired={openAuth} />;
    }
  };

  const showFooter = nav.page !== 'checkout';

  return (
    <div className="min-h-screen bg-white">
      <Header
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={openAuth}
        isAdmin={isAdmin}
        onAdminOpen={() => setShowAdmin(true)}
      />
      <main>{renderPage()}</main>
      {showFooter && <Footer />}
      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onAuthRequired={() => { setCartOpen(false); openAuth(); }}
        />
      )}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}