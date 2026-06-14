import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, User } from 'lucide-react'
import { inputStyle, Table, Tr, Td } from '../components/AdminUI'

interface Profile {
  id: string; full_name: string; phone: string
  address: string; city: string; zip_code: string; created_at: string
}

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProfiles(data ?? []); setLoading(false) })
  }, [])

  const filtered = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>Пользователи</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{profiles.length} профилей в базе</p>
      </div>

      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Имя, телефон, город..." style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
      </div>

      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#475569' }}>Загрузка...</div>
        ) : (
          <Table headers={['Пользователь', 'Телефон', 'Город', 'Адрес', 'Дата регистрации']}>
            {filtered.map(p => (
              <Tr key={p.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={15} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>{p.full_name || '—'}</div>
                      <div style={{ color: '#475569', fontSize: 11 }}>{p.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </Td>
                <Td><span style={{ color: '#94a3b8' }}>{p.phone || '—'}</span></Td>
                <Td><span style={{ color: '#94a3b8' }}>{p.city || '—'}</span></Td>
                <Td><span style={{ color: '#94a3b8', fontSize: 13 }}>{p.address ? `${p.address}${p.zip_code ? ', ' + p.zip_code : ''}` : '—'}</span></Td>
                <Td><span style={{ color: '#64748b', fontSize: 13 }}>{new Date(p.created_at).toLocaleDateString('ru')}</span></Td>
              </Tr>
            ))}
            {filtered.length === 0 && (
              <Tr><Td style={{ textAlign: 'center', color: '#475569', padding: '32px 0' }}>Пользователи не найдены</Td></Tr>
            )}
          </Table>
        )}
      </div>
    </div>
  )
}
