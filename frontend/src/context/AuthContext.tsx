import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { Credentials, User } from '../api/auth'

interface AuthContextValue { user: User | null; loading: boolean; login: (credentials: Credentials) => Promise<void>; logout: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.getCurrentUser().then(setUser).catch(() => localStorage.removeItem('flashcards_token')).finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials: Credentials) => { setUser(await authApi.login(credentials)) }, [])
  const logout = useCallback(async () => { await authApi.logout(); setUser(null) }, [])
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
