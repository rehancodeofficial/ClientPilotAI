import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { apiGet } from '@/api/client'
import { Loader2 } from 'lucide-react'

export function AuthGuard() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const authToken = useAppStore((s) => s.authToken)
  const demoToken = useAppStore((s) => s.demoToken)
  const setUserRole = useAppStore((s) => s.setUserRole)
  const setUserEmail = useAppStore((s) => s.setUserEmail)
  const clearAuth = useAppStore((s) => s.clearAuth)

  useEffect(() => {
    let active = true

    const verifySession = async () => {
      // 1. Check if we have a demo token
      if (demoToken) {
        if (active) {
          setIsAuthenticated(true)
          setLoading(false)
        }
        return
      }

      // 2. Check if we have a custom authToken
      const token = authToken || (typeof window !== 'undefined' ? localStorage.getItem('cp_auth_token') : null)
      if (!token) {
        if (active) {
          setIsAuthenticated(false)
          setLoading(false)
        }
        return
      }

      // 3. Verify token with /api/auth/me
      try {
        const response = await apiGet<{
          user: {
            id: string
            email: string
            role: 'admin' | 'user' | 'client'
            fullName?: string
          }
        }>('/auth/me')

        if (!active) return

        if (response?.user) {
          setUserEmail(response.user.email)
          setUserRole((response.user.role as 'admin' | 'user') || 'user')
          setIsAuthenticated(true)
        } else {
          clearAuth()
          setIsAuthenticated(false)
        }
      } catch (err) {
        if (!active) return
        console.warn('[AuthGuard] Token verification failed:', err)
        clearAuth()
        setIsAuthenticated(false)
      } finally {
        if (active) setLoading(false)
      }
    }

    verifySession()

    return () => {
      active = false
    }
  }, [authToken, demoToken, setUserRole, setUserEmail, clearAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!isAuthenticated && !demoToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
