import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Zap,
  Bell,
  ChevronRight,
} from 'lucide-react'

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'users'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage: AdminPage
  onNavigate: (page: AdminPage) => void
  onExitAdmin: () => void
}

const NAV_ITEMS = [
  { id: 'dashboard' as AdminPage, label: 'Дашборд', icon: LayoutDashboard },
  { id: 'products' as AdminPage, label: 'Товары', icon: Package },
  { id: 'categories' as AdminPage, label: 'Категории', icon: Tag },
  { id: 'orders' as AdminPage, label: 'Заказы', icon: ShoppingCart },
  { id: 'users' as AdminPage, label: 'Пользователи', icon: Users },
]

export default function AdminLayout({ children, currentPage, onNavigate, onExitAdmin }: AdminLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Top Nav */}
      <header style={{ background: '#161b27', borderBottom: '1px solid #1e2535', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>VoltStore</span>
          <span style={{ color: '#475569', fontSize: 14 }}>/</span>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            <Bell size={18} />
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
            TU
          </div>
          <button
            onClick={onExitAdmin}
            style={{ background: 'none', border: '1px solid #1e2535', color: '#94a3b8', cursor: 'pointer', padding: '4px 12px', borderRadius: 6, fontSize: 13 }}
          >
            Выйти из Admin
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#161b27', borderRight: '1px solid #1e2535', padding: '16px 12px', flexShrink: 0 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = currentPage === id
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: active ? '#60a5fa' : '#94a3b8',
                    fontSize: 14, fontWeight: active ? 600 : 400,
                    textAlign: 'left', width: '100%',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={16} />
                  {label}
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
