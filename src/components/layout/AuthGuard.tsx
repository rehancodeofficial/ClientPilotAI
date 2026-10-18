import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import { useAppStore } from '@/store/useAppStore'
import { Loader2 } from 'lucide-react'

export function AuthGuard() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const setUserRole = useAppStore((s) => s.setUserRole)
  const setUserEmail = useAppStore((s) => s.setUserEmail)
  // A demo session is represented by the token minted by POST /api/auth/demo.
  // The token is the credential; a role value on its own is not.
  const demoToken = useAppStore((s) => s.demoToken)

  useEffect(() => {
    let active = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!active) return
        setSession(session)
        if (session?.user) {
          setUserEmail(session.user.email ?? null)
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          
          if (!active) return
          if (data && !error) {
            setUserRole(data.role as 'admin' | 'user')
          } else {
            setUserRole('user')
          }
        }
      } catch {
        if (active) setUserRole('user')
      } finally {
        if (active) setLoading(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return
      setSession(session)
      if (session?.user) {
        setUserEmail(session.user.email ?? null)
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          if (!active) return
          if (data && !error) {
            setUserRole(data.role as 'admin' | 'user')
          } else {
            setUserRole('user')
          }
        } catch {
          if (active) setUserRole('user')
        }
      } else if (!useAppStore.getState().demoToken) {
        // Signed out and not in a demo session: clear the cached identity.
        setUserEmail(null)
        setUserRole(null)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [setUserRole, setUserEmail])

  // Entry previously required only `userRole !== null`. Because the role is set
  // client-side before any credential is verified, anything that wrote a role —
  // the former hardcoded admin branch, or the demo login's failure path — let a
  // caller straight through this guard. Access now requires an actual
  // credential: a Supabase session, or a demo token issued by the backend.
  if (demoToken) {
    return <Outlet />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
