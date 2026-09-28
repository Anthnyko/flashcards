import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/login') }
  const linkClass = ({ isActive }: { isActive: boolean }) => `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`

  return <header className="border-b border-slate-200 bg-white">
    <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
      <Link to="/" className="mr-3 text-xl font-bold tracking-tight text-indigo-700">Recall</Link>
      <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
      <NavLink to="/search" className={linkClass}>Search</NavLink>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:block">{user?.email}</span>
        <button onClick={handleLogout} className="button-secondary">Logout</button>
      </div>
    </nav>
  </header>
}
