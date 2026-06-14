import { useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

// ─── Modal ──────────────────────────────────────────────────────────────────
interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
}

export function Modal({ title, onClose, children, width = 560 }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #1e2535' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4, borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── ConfirmDialog ───────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({ message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div style={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 12, padding: 28, maxWidth: 400, width: '90%' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
          <AlertTriangle size={22} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: 15, lineHeight: 1.5 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #1e2535', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}>
            Отмена
          </button>
          <button onClick={onConfirm} disabled={loading} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeVariant = 'game' | 'software' | 'antivirus' | 'featured' | 'default'

const BADGE_STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
  game:     { bg: 'rgba(59,130,246,0.2)',  color: '#60a5fa' },
  software: { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  antivirus:{ bg: 'rgba(236,72,153,0.15)', color: '#f472b6' },
  featured: { bg: 'rgba(245,158,11,0.2)',  color: '#fbbf24' },
  default:  { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
}

export function Badge({ label, variant = 'default' }: { label: string; variant?: BadgeVariant }) {
  const s = BADGE_STYLES[variant] ?? BADGE_STYLES.default
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, textTransform: 'uppercase', letterSpacing: 0.3 }}>
      {label}
    </span>
  )
}

// ─── FormField ───────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

export function FormField({ label, required, children, hint }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 12, color: '#64748b' }}>{hint}</span>}
    </div>
  )
}

// ─── Input styles (shared) ────────────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  background: '#0f1117',
  border: '1px solid #1e2535',
  borderRadius: 8,
  padding: '9px 12px',
  color: '#e2e8f0',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

// ─── Btn ─────────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
}

export function Btn({ variant = 'primary', style, children, ...rest }: BtnProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 18px', borderRadius: 8, border: 'none',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    transition: 'opacity 0.15s',
    ...style,
  }
  const variants = {
    primary: { background: '#3b82f6', color: '#fff' },
    ghost:   { background: 'transparent', color: '#94a3b8', border: '1px solid #1e2535' },
    danger:  { background: '#ef4444', color: '#fff' },
  }
  return <button style={{ ...base, ...variants[variant] }} {...rest}>{children}</button>
}

// ─── StatusBadge for orders ───────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Ожидает',   color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
  processing: { label: 'В работе',  color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
  completed:  { label: 'Выполнен',  color: '#4ade80', bg: 'rgba(34,197,94,0.15)'  },
  cancelled:  { label: 'Отменён',   color: '#f87171', bg: 'rgba(239,68,68,0.15)'  },
}

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg }}>
      {s.label}
    </span>
  )
}

// ─── Table ───────────────────────────────────────────────────────────────────
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #1e2535' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      style={{ borderBottom: '1px solid #1e2535', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </tr>
  )
}

export function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: '13px 14px', color: '#cbd5e1', verticalAlign: 'middle', ...style }}>{children}</td>
}
