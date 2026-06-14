import { useState } from 'react';
import { ShoppingCart, Zap, Menu, X, Package, LogOut, User, Search, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  isAdmin?: boolean;
  onAdminOpen?: () => void;
}

export default function Header({ onCartOpen, onAuthOpen, isAdmin, onAdminOpen }: HeaderProps) {
  const { t } = useTranslation();
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Volt<span className="text-cyan-400">Store</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('home')}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => navigate('products')}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              {t('nav.products')}
            </button>
            {user && (
              <button
                onClick={() => navigate('orders')}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                {t('nav.myOrders')}
              </button>
            )}
            {isAdmin && (
              <button
                onClick={onAdminOpen}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                <Shield className="w-4 h-4" />
                Админка
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={() => navigate('products')}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onCartOpen}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <div className="w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-900" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-300">
                    {user.email?.split('@')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    {isAdmin && (
                      <button
                        onClick={() => { onAdminOpen?.(); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-cyan-400 hover:bg-slate-700 transition-colors border-b border-slate-700"
                      >
                        <Shield className="w-4 h-4" />
                        Админка
                      </button>
                    )}
                    <button
                      onClick={() => { navigate('orders'); setUserMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      {t('nav.myOrders')}
                    </button>
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('auth.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthOpen}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold rounded-lg transition-colors"
              >
                {t('auth.signIn')}
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1">
          <button
            onClick={() => { navigate('home'); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => { navigate('products'); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
          >
            {t('nav.products')}
          </button>
          {user && (
            <button
              onClick={() => { navigate('orders'); setMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
            >
              {t('nav.myOrders')}
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => { onAdminOpen?.(); setMenuOpen(false); }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-cyan-400 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
            >
              <Shield className="w-4 h-4" />
              Админка
            </button>
          )}
        </div>
      )}
    </header>
  );
}