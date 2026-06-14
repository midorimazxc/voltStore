import { useState } from 'react'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminCategories from './pages/AdminCategories'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'

type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders' | 'users'

interface AdminPanelProps {
  onExit: () => void
}

export default function AdminPanel({ onExit }: AdminPanelProps) {
  const [page, setPage] = useState<AdminPage>('dashboard')

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <AdminDashboard />
      case 'products':   return <AdminProducts />
      case 'categories': return <AdminCategories />
      case 'orders':     return <AdminOrders />
      case 'users':      return <AdminUsers />
    }
  }

  return (
    <AdminLayout currentPage={page} onNavigate={setPage} onExitAdmin={onExit}>
      {renderPage()}
    </AdminLayout>
  )
}
