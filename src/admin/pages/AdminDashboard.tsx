import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Tag, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react'
import { StatusBadge } from '../components/AdminUI'

interface Stats {
  products: number; categories: number; orders: number; users: number
  revenue: number; pendingOrders: number
}

interface RecentOrder {
  id: string; customer_name: string; customer_email: string
  total: number; status: string; created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, orders: 0, users: 0, revenue: 0, pendingOrders: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: products },
        { count: categories },
        { data: orders },
        { count: users },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('id, customer_name, customer_email, total, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])

      const allOrders = orders ?? []
      setRecentOrders(allOrders)

      const { data: allForStats } = await supabase.from('orders').select('total, status')
      const revenue = (allForStats ?? []).filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0)
      const pendingOrders = (allForStats ?? []).filter(o => o.status === 'pending').length

      setStats({ products: products ?? 0, categories: categories ?? 0, orders: allForStats?.length ?? 0, users: users ?? 0, revenue, pendingOrders })
      setLoading(false)
    }
    load()
  }, [])

  const STAT_CARDS = [
    { label: 'Товары', value: stats.products, icon: Package, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Категории', value: stats.categories, icon: Tag, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Заказы', value: stats.orders, icon: ShoppingCart, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Пользователи', value: stats.users, icon: Users, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Выручка (completed)', value: `$${stats.revenue.toFixed(0)}`, icon: DollarSign, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    { label: 'Ожидают оплаты', value: stats.pendingOrders, icon: TrendingUp, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>Дашборд</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Обзор магазина</p>
      </div>

      {loading ? (
        <div style={{ color: '#475569', padding: 48, textAlign: 'center' }}>Загрузка...</div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, padding: '20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={color} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #1e2535' }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Последние заказы</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['ID', 'Клиент', 'Сумма', 'Статус', 'Дата'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid #1e2535' }}>
                    <td style={{ padding: '12px 16px' }}><code style={{ color: '#60a5fa', fontSize: 12 }}>{o.id.slice(0, 8)}</code></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13 }}>{o.customer_name}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{o.customer_email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4ade80', fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={o.status} /></td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString('ru')}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '32px 0', textAlign: 'center', color: '#475569' }}>Заказов пока нет</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
