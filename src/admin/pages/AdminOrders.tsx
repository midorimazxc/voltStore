import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, ChevronDown } from 'lucide-react'
import { Modal, StatusBadge, inputStyle, selectStyle, Table, Tr, Td } from '../components/AdminUI'

interface OrderItem { id: string; product_name: string; product_image: string; quantity: number; price: number }
interface Order {
  id: string; user_id: string | null; status: string
  subtotal: number; processing_fee: number; total: number
  customer_name: string; customer_email: string; customer_phone: string
  created_at: string; order_items?: OrderItem[]
}

const STATUSES = ['pending', 'processing', 'completed', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(id, product_name, product_image, quantity, price)')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdatingId(orderId)
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
    setUpdatingId(null)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    if (selectedOrder?.id === orderId) setSelectedOrder(o => o ? { ...o, status } : o)
  }

  const filtered = orders.filter(o => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>Заказы</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{orders.length} заказов всего</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Имя, email или ID..." style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...selectStyle, width: 180, paddingRight: 32 }}>
            <option value="all">Все статусы</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Ожидают', status: 'pending', color: '#fbbf24' },
          { label: 'В работе', status: 'processing', color: '#60a5fa' },
          { label: 'Выполнены', status: 'completed', color: '#4ade80' },
          { label: 'Отменены', status: 'cancelled', color: '#f87171' },
        ].map(({ label, status, color }) => (
          <div key={status} style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 10, padding: '14px 16px', cursor: 'pointer' }}
            onClick={() => setStatusFilter(s => s === status ? 'all' : status)}>
            <div style={{ fontSize: 24, fontWeight: 700, color }}>{orders.filter(o => o.status === status).length}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#475569' }}>Загрузка...</div>
        ) : (
          <Table headers={['ID', 'Клиент', 'Сумма', 'Статус', 'Дата', 'Изменить статус']}>
            {filtered.map(o => (
              <Tr key={o.id} onClick={() => setSelectedOrder(o)}>
                <Td><code style={{ color: '#60a5fa', fontSize: 12 }}>{o.id.slice(0, 8)}</code></Td>
                <Td>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 13 }}>{o.customer_name}</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{o.customer_email}</div>
                </Td>
                <Td><span style={{ color: '#4ade80', fontWeight: 700 }}>${o.total.toFixed(2)}</span></Td>
                <Td><StatusBadge status={o.status} /></Td>
                <Td><span style={{ color: '#64748b', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString('ru')}</span></Td>
                <Td onClick={e => e.stopPropagation()}>
                  <select
                    value={o.status}
                    disabled={updatingId === o.id}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    style={{ ...selectStyle, width: 140, fontSize: 13, padding: '5px 8px' }}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Td>
              </Tr>
            ))}
            {filtered.length === 0 && (
              <Tr><Td style={{ textAlign: 'center', color: '#475569', padding: '32px 0' }}>Заказы не найдены</Td></Tr>
            )}
          </Table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal title={`Заказ #${selectedOrder.id.slice(0, 8)}`} onClose={() => setSelectedOrder(null)} width={600}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Клиент', selectedOrder.customer_name],
                ['Email', selectedOrder.customer_email],
                ['Телефон', selectedOrder.customer_phone || '—'],
                ['Статус', ''],
              ].map(([label, value]) => (
                <div key={label} style={{ background: '#0f1117', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>{label}</div>
                  {label === 'Статус'
                    ? <StatusBadge status={selectedOrder.status} />
                    : <div style={{ color: '#f1f5f9', fontSize: 14 }}>{value}</div>
                  }
                </div>
              ))}
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Товары</div>
              {selectedOrder.order_items?.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e2535' }}>
                  <div>
                    <div style={{ color: '#f1f5f9', fontSize: 14 }}>{item.product_name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>× {item.quantity}</div>
                  </div>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#0f1117', borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Подитог', `$${selectedOrder.subtotal.toFixed(2)}`],
                ['Комиссия', `$${selectedOrder.processing_fee.toFixed(2)}`],
                ['Итого', `$${selectedOrder.total.toFixed(2)}`],
              ].map(([l, v], i) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', color: i === 2 ? '#f1f5f9' : '#64748b', fontWeight: i === 2 ? 700 : 400, fontSize: i === 2 ? 16 : 14 }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
