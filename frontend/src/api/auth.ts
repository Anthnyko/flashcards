import api from './axios'

export interface User { id: number; email: string }
export interface Credentials { email: string; password: string }
interface LoginResponse { access_token?: string; token_type?: string; user?: User }

export const register = async (credentials: Credentials) =>
  (await api.post<User>('/auth/register', credentials)).data

export const login = async (credentials: Credentials) => {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials)
  if (data.access_token) localStorage.setItem('flashcards_token', data.access_token)
  return data.user ?? (await getCurrentUser())
}

export const getCurrentUser = async () => (await api.get<User>('/auth/me')).data

export const logout = async () => {
  try { await api.post('/auth/logout') } finally { localStorage.removeItem('flashcards_token') }
}
