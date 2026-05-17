import { createContext, useContext, useState, ReactNode } from 'react';
import { Page } from '../lib/types';

interface NavigationState {
  page: Page;
  productId: string | null;
  orderId: string | null;
  categoryId: string | null; // 👈
}

interface NavigationContextType {
  nav: NavigationState;
  navigate: (page: Page, params?: { productId?: string; orderId?: string }) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<NavigationState>({
    page: 'home',
    productId: null,
    orderId: null,
    categoryId: null, // 👈
  });

  const navigate: (page: Page, params?: { productId?: string; orderId?: string; categoryId?: string }) => void = (page, params) => {
    setNav({
      page,
      productId: params?.productId ?? null,
      orderId: params?.orderId ?? null,
      categoryId: params?.categoryId ?? null, // 👈
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ nav, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
