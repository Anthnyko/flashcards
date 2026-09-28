import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import DeckView from '../pages/DeckView'
import CardEditor from '../pages/CardEditor'
import StudySession from '../pages/StudySession'
import Search from '../pages/Search'

function ProtectedLayout() {
  const { user, loading } = useAuth(); const location = useLocation()
  if (loading) return <main className="flex min-h-screen items-center justify-center text-slate-500">Loading…</main>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <><Navbar /><Outlet /></>
}

export default function AppRouter() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/deck/:id" element={<DeckView />} />
      <Route path="/deck/:id/edit" element={<CardEditor />} />
      <Route path="/study/:id" element={<StudySession />} />
      <Route path="/search" element={<Search />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
