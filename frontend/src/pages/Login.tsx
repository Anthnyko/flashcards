import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const messageFor = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.detail ?? 'Unable to sign in.' : 'Unable to sign in.'

export default function Login() {
  const { user, login } = useAuth(); const navigate = useNavigate(); const location = useLocation()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false)
  if (user) return <Navigate to="/" replace />
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(''); setSubmitting(true); try { await login({ email, password }); navigate(location.state?.from?.pathname ?? '/') } catch (err) { setError(messageFor(err)) } finally { setSubmitting(false) } }
  return <main className="flex min-h-screen items-center justify-center px-4"><form className="panel w-full max-w-md space-y-5" onSubmit={submit}>
    <div><h1 className="text-2xl font-bold">Welcome back</h1><p className="mt-1 text-sm text-slate-500">Sign in to continue reviewing.</p></div>
    {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    <label className="block text-sm font-medium">Email<input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
    <label className="block text-sm font-medium">Password<input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
    <button className="button-primary w-full" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
    <p className="text-center text-sm text-slate-500">New here? <Link className="font-medium text-indigo-700 hover:underline" to="/register">Create an account</Link></p>
  </form></main>
}
