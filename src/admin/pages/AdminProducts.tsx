import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Search, Pencil, Trash2, Star, CheckCircle } from 'lucide-react'
import {
  Modal, ConfirmDialog, Badge, FormField,
  inputStyle, selectStyle, Btn, Table, Tr, Td,
} from '../components/AdminUI'

interface Category { id: string; name: string; slug: string }
interface Product {
  id: string; name: string; description: string
  price: number; original_price: number | null
  category_id: string | null; image_url: string
  rating: number; review_count: number; is_featured: boolean
  key_type: string; platform: string | null; created_at: string
  categories?: Category
}

const EMPTY_FORM = {
  name: '', description: '', price: '', original_price: '',
  category_id: '', image_url: '', key_type: 'game',
  platform: '', is_featured: false,
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, categories(id,name,slug)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(prods ?? [])
    setCategories(cats ?? [])
    setLoading(false)
  }

  function openCreate() {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      original_price: p.original_price != null ? String(p.original_price) : '',
      category_id: p.category_id ?? '',
      image_url: p.image_url,
      key_type: p.key_type,
      platform: p.platform ?? '',
      is_featured: p.is_featured,
    })
    setError('')
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price) { setError('Название и цена обязательны'); return }
    setSaving(true); setError('')
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      category_id: form.category_id || null,
      image_url: form.image_url.trim(),
      key_type: form.key_type,
      platform: form.platform.trim() || null,
      is_featured: form.is_featured,
    }
    const { error: err } = editProduct
      ? await supabase.from('products').update(payload).eq('id', editProduct.id)
      : await supabase.from('products').insert(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    setModalOpen(false)
    fetchAll()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('products').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    fetchAll()
  }

  async function toggleFeatured(p: Product) {
    await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id)
    fetchAll()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.key_type.toLowerCase().includes(search.toLowerCase())
  )

  const field = (key: keyof typeof form, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>Товары</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{products.length} товаров в базе</p>
        </div>
        <Btn onClick={openCreate}><Plus size={16} /> Добавить товар</Btn>
      </div>

      {/* Search */}
      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск товара..."
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#475569' }}>Загрузка...</div>
        ) : (
          <Table headers={['Товар', 'Тип / Платформа', 'Цена', 'Рейтинг', 'Отзывы', 'Featured', 'Действия']}>
            {filtered.map(p => (
              <Tr key={p.id}>
                <Td>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>{p.name}</div>
                  <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{p.id.slice(0, 8)}</div>
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Badge label={p.key_type} variant={p.key_type as any} />
                    {p.platform && <span style={{ color: '#94a3b8', fontSize: 13 }}>{p.platform}</span>}
                  </div>
                </Td>
                <Td>
                  <span style={{ color: '#f1f5f9', fontWeight: 600 }}>${p.price}</span>
                  {p.original_price && (
                    <span style={{ color: '#475569', fontSize: 12, textDecoration: 'line-through', marginLeft: 6 }}>${p.original_price}</span>
                  )}
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontWeight: 700 }}>
                    <Star size={13} fill="#fbbf24" />
                    {p.rating?.toFixed(2)}
                  </div>
                </Td>
                <Td><span style={{ color: '#94a3b8' }}>{p.review_count}</span></Td>
                <Td>
                  <button onClick={() => toggleFeatured(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {p.is_featured
                      ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}><CheckCircle size={12} /> Featured</span>
                      : <span style={{ color: '#475569', fontSize: 13 }}>— Нет</span>
                    }
                  </button>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={{ background: '#1e2535', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteId(p.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
            {filtered.length === 0 && (
              <Tr>
                <Td style={{ textAlign: 'center', color: '#475569', padding: '32px 0' }}>Товары не найдены</Td>
              </Tr>
            )}
          </Table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <Modal title={editProduct ? 'Редактировать товар' : 'Добавить товар'} onClose={() => setModalOpen(false)} width={620}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Название" required>
                <input value={form.name} onChange={e => field('name', e.target.value)} style={inputStyle} placeholder="GTA V Premium" />
              </FormField>
              <FormField label="Категория">
                <select value={form.category_id} onChange={e => field('category_id', e.target.value)} style={selectStyle}>
                  <option value="">— Без категории</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="Описание">
              <textarea value={form.description} onChange={e => field('description', e.target.value)}
                style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Описание товара..." />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Цена ($)" required>
                <input value={form.price} onChange={e => field('price', e.target.value)} style={inputStyle} type="number" step="0.01" placeholder="14.99" />
              </FormField>
              <FormField label="Старая цена ($)" hint="Оставьте пустым если нет скидки">
                <input value={form.original_price} onChange={e => field('original_price', e.target.value)} style={inputStyle} type="number" step="0.01" placeholder="29.99" />
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Тип">
                <select value={form.key_type} onChange={e => field('key_type', e.target.value)} style={selectStyle}>
                  <option value="game">game</option>
                  <option value="software">software</option>
                  <option value="antivirus">antivirus</option>
                </select>
              </FormField>
              <FormField label="Платформа">
                <input value={form.platform} onChange={e => field('platform', e.target.value)} style={inputStyle} placeholder="PC, Windows, Win/Mac..." />
              </FormField>
            </div>

            <FormField label="URL изображения">
              <input value={form.image_url} onChange={e => field('image_url', e.target.value)} style={inputStyle} placeholder="https://..." />
            </FormField>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_featured} onChange={e => field('is_featured', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#3b82f6' }} />
              <span style={{ fontSize: 14, color: '#cbd5e1' }}>Показать как Featured</span>
            </label>

            {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Btn variant="ghost" onClick={() => setModalOpen(false)}>Отмена</Btn>
              <Btn onClick={handleSave} disabled={saving}>{saving ? 'Сохранение...' : editProduct ? 'Сохранить' : 'Добавить'}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      {deleteId && (
        <ConfirmDialog
          message={`Удалить товар? Это действие нельзя отменить.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
