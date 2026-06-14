import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, inputStyle, Btn, Table, Tr, Td } from '../components/AdminUI'

interface Category { id: string; name: string; slug: string; icon: string; created_at: string }

const EMPTY = { name: '', slug: '', icon: '' }

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCats(data ?? [])
    setLoading(false)
  }

  function openCreate() {
    setEditCat(null); setForm(EMPTY); setError(''); setModalOpen(true)
  }

  function openEdit(c: Category) {
    setEditCat(c)
    setForm({ name: c.name, slug: c.slug, icon: c.icon })
    setError(''); setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) { setError('Название и slug обязательны'); return }
    setSaving(true); setError('')
    const payload = { name: form.name.trim(), slug: form.slug.trim(), icon: form.icon.trim() }
    const { error: err } = editCat
      ? await supabase.from('categories').update(payload).eq('id', editCat.id)
      : await supabase.from('categories').insert(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    setModalOpen(false); fetch()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('categories').delete().eq('id', deleteId)
    setDeleting(false); setDeleteId(null); fetch()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>Категории</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{cats.length} категорий</p>
        </div>
        <Btn onClick={openCreate}><Plus size={16} /> Добавить категорию</Btn>
      </div>

      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#475569' }}>Загрузка...</div>
        ) : (
          <Table headers={['Иконка', 'Название', 'Slug', 'Дата создания', 'Действия']}>
            {cats.map(c => (
              <Tr key={c.id}>
                <Td>
                  <div style={{ width: 36, height: 36, background: '#1e2535', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {c.icon || <Tag size={16} color="#475569" />}
                  </div>
                </Td>
                <Td><span style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.name}</span></Td>
                <Td><code style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>{c.slug}</code></Td>
                <Td><span style={{ color: '#64748b', fontSize: 13 }}>{new Date(c.created_at).toLocaleDateString('ru')}</span></Td>
                <Td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(c)} style={{ background: '#1e2535', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
            {cats.length === 0 && (
              <Tr><Td style={{ textAlign: 'center', color: '#475569', padding: '32px 0' }}>Категории не найдены</Td></Tr>
            )}
          </Table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editCat ? 'Редактировать категорию' : 'Добавить категорию'} onClose={() => setModalOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Название" required>
              <input
                value={form.name}
                onChange={e => {
                  const name = e.target.value
                  setForm(f => ({ ...f, name, slug: editCat ? f.slug : toSlug(name) }))
                }}
                style={inputStyle} placeholder="Игры"
              />
            </FormField>
            <FormField label="Slug" required hint="Используется в URL, только латиница и дефисы">
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))} style={inputStyle} placeholder="games" />
            </FormField>
            <FormField label="Иконка (emoji)" hint="Необязательно, например: 🎮 💻 🛡️">
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} style={inputStyle} placeholder="🎮" />
            </FormField>

            {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Btn variant="ghost" onClick={() => setModalOpen(false)}>Отмена</Btn>
              <Btn onClick={handleSave} disabled={saving}>{saving ? 'Сохранение...' : editCat ? 'Сохранить' : 'Добавить'}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Удалить категорию? Товары в этой категории останутся, но потеряют привязку."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
