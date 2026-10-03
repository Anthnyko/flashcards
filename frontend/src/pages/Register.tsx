import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { register } from '../api/auth'

export default function Register() {
  const navigate = useNavigate(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(''); setSubmitting(true); try { await register({ email, password }); navigate('/login', { state: { notice: 'Account created. Please sign in.' } }) } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.detail ?? 'Unable to create account.' : 'Unable to create account.') } finally { setSubmitting(false) } }
  return <main className="flex min-h-screen items-center justify-center px-4"><form className="panel w-full max-w-md space-y-5" onSubmit={submit}>
    <div><h1 className="text-2xl font-bold">Create account</h1><p className="mt-1 text-sm text-slate-500">Start building your memory practice.</p></div>
    {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    <label className="block text-sm font-medium">Email<input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
    <label className="block text-sm font-medium">Password<input className="field" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></label>
    <button className="button-primary w-full" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
    <p className="text-center text-sm text-slate-500">Already registered? <Link className="font-medium text-indigo-700 hover:underline" to="/login">Sign in</Link></p>
  </form></main>
}
