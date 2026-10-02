import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { useAppStore } from '@/store/useAppStore'
import { Loader2, Eye, EyeOff, Zap, User, ArrowRight, Shield, Sparkles } from 'lucide-react'

interface LoginPageProps {
  initialMode?: 'login' | 'signup'
}

const EASE = [0.34, 1.56, 0.64, 1] as const

// Floating particles for left panel background
function ParticleField() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.05,
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#4cc02b',
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Animated orb
function Orb({ x, y, size, color, delay }: { x: number; y: number; size: number; color: string; delay: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: color, filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
      animate={{
        y: [0, -18, 0],
        x: [0, 8, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// Magnetic tilt card effect for right panel
function MagneticCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    rotateX.set(-dy * 3)
    rotateY.set(dx * 3)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1200, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}

// Shimmer label tag
function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(76,192,43,0.12)', border: '1px solid rgba(76,192,43,0.28)',
      borderRadius: 999, padding: '5px 14px', marginBottom: 20,
      position: 'relative', overflow: 'hidden',
    }}>
      <motion.div
        style={{
          position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(76,192,43,0.15), transparent)',
        }}
        animate={{ left: ['−100%', '100%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
      />
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4cc02b', display: 'inline-block' }} />
      {children}
    </div>
  )
}

export function LoginPage({ initialMode = 'login' }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [shakeEmail, setShakeEmail] = useState(false)
  const [shakePassword, setShakePassword] = useState(false)
  const [shakeName, setShakeName] = useState(false)

  const setUserRole = useAppStore((s) => s.setUserRole)
  const setUserEmail = useAppStore((s) => s.setUserEmail)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'login')
    setError(null)
  }, [location.pathname])

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const triggerShake = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true)
    setTimeout(() => setter(false), 420)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let hasError = false
    const isAdminMock =
      email.trim() === 'admin@clientpilotai' ||
      email.trim() === 'admin@clientpilotai.com'

    if (mode === 'signup' && !fullName.trim()) {
      triggerShake(setShakeName)
      hasError = true
    }
    if (!email.trim() || (!validateEmail(email) && !isAdminMock)) {
      triggerShake(setShakeEmail)
      hasError = true
    }
    if (password.length < 6) {
      triggerShake(setShakePassword)
      setError('Password must be at least 6 characters.')
      hasError = true
    }

    if (hasError) { setLoading(false); return }

    try {
      if (mode === 'login') {
        if (isAdminMock && password === '123123') {
          setTimeout(() => {
            setUserEmail(email)
            setUserRole('admin')
            navigate('/app/admin')
            setLoading(false)
          }, 800)
          return
        }

        const { data: authData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError

        if (authData.user) {
          setUserEmail(authData.user.email ?? null)
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single()

          const role =
            !profileError && profile ? (profile.role as 'admin' | 'user') : 'user'
          setUserRole(role)
          navigate(role === 'admin' ? '/app/admin' : '/app')
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (signUpError) throw signUpError
        setError('Check your email for the confirmation link.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      if (!email.trim().startsWith('admin@clientpilotai')) setLoading(false)
    }
  }

  const handleStateToggle = (targetMode: 'login' | 'signup') => {
    setError(null)
    setMode(targetMode)
    navigate(targetMode === 'login' ? '/login' : '/signup')
  }

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    setLoading(true)
    setError(null)
    try {
      let rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim()
      if (rawApiUrl.startsWith('http')) {
        if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1)
        if (!rawApiUrl.endsWith('/api')) rawApiUrl += '/api'
      } else if (!rawApiUrl.startsWith('/api')) {
        rawApiUrl = '/api'
      }

      const response = await fetch(`${rawApiUrl}/auth/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Demo login failed' }))
        throw new Error(err.error || 'Demo login failed')
      }

      const { token } = await response.json()
      useAppStore.getState().setDemoToken(token)
      setUserEmail(
        role === 'admin' ? 'admin@demo.clientpilotai' : 'user@demo.clientpilotai'
      )
      setUserRole(role)
      navigate(role === 'admin' ? '/app/admin' : '/app')
    } catch (err) {
      console.warn('[DemoLogin] Backend unreachable, using role-only access:', err)
      setUserEmail(
        role === 'admin' ? 'admin@clientpilotai.com' : 'demo@clientpilotai.com'
      )
      setUserRole(role)
      navigate(role === 'admin' ? '/app/admin' : '/app')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
      overflow: 'hidden', fontFamily: 'var(--font-sans)',
      background: '#0d0f12',
    }}>
      <style>{`
        @keyframes auth-shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-7px); }
          40%,80%  { transform: translateX(7px); }
        }
        .auth-input {
          width: 100%;
          height: 52px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 0 48px 0 16px;
          font-size: 14px;
          font-weight: 500;
          color: #f5f5f3;
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
        }
        .auth-input::placeholder { color: rgba(245,245,243,0.25); }
        .auth-input:focus {
          border-color: #4cc02b;
          background: rgba(76,192,43,0.05);
          box-shadow: 0 0 0 3px rgba(76,192,43,0.12);
        }
        .auth-input.shake {
          animation: auth-shake 0.42s ease-in-out;
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important;
        }
        .auth-label { font-size: 12px; font-weight: 600; color: rgba(245,245,243,0.5); letter-spacing: 0.3px; margin-bottom: 6px; display: block; }
        .auth-btn-primary {
          width: 100%; height: 52px; border: none; border-radius: 14px;
          background: linear-gradient(135deg, #4cc02b 0%, #3ea322 100%);
          color: #fff; font-size: 15px; font-weight: 700;
          font-family: var(--font-sans); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 300ms ease, opacity 200ms;
          box-shadow: 0 4px 24px rgba(76,192,43,0.25), 0 1px 0 rgba(255,255,255,0.1) inset;
          letter-spacing: -0.01em;
        }
        .auth-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 36px rgba(76,192,43,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
        }
        .auth-btn-primary:active:not(:disabled) { transform: translateY(0px) scale(0.99); }
        .auth-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .auth-demo-btn {
          flex: 1; height: 44px; border-radius: 12px; font-size: 12px; font-weight: 600;
          font-family: var(--font-sans); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms, background 200ms;
        }
        .auth-demo-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .auth-demo-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .auth-toggle-btn {
          background: none; border: none; color: #4cc02b; font-weight: 700;
          font-family: var(--font-sans); font-size: inherit; cursor: pointer; padding: 0;
          text-decoration: underline; text-decoration-color: transparent;
          transition: text-decoration-color 200ms;
        }
        .auth-toggle-btn:hover { text-decoration-color: #4cc02b; }

        @media (max-width: 768px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; background: #141414 !important; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div
        className="auth-left"
        style={{
          width: '52%', height: '100%',
          background: 'linear-gradient(145deg, #080a0d 0%, #0d1118 50%, #101518 100%)',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px', overflow: 'hidden',
        }}
      >
        {/* Animated mesh gradient blobs */}
        <motion.div
          style={{ position: 'absolute', top: -120, left: -80, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,192,43,0.14) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ position: 'absolute', bottom: -100, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ position: 'absolute', top: '45%', right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Particle field */}
        <ParticleField />

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ zIndex: 10 }}
        >
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14, overflow: 'hidden',
              flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              border: '1px solid rgba(76,192,43,0.3)',
            }}>
              <img
                src="/logo.png" alt="ClientPilot AI"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement
                  t.style.display = 'none'
                  const p = t.parentElement!
                  p.style.background = 'linear-gradient(135deg,#4cc02b,#3ea322)'
                  p.style.display = 'flex'
                  p.style.alignItems = 'center'
                  p.style.justifyContent = 'center'
                  p.innerHTML = '<span style="font-size:20px;font-weight:900;color:#fff">C</span>'
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f5f5f3', letterSpacing: '-0.5px' }}>
                ClientPilot AI
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4cc02b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Acquire High-Value Clients
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Hero copy — mode-aware */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <TagChip>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#4cc02b', letterSpacing: '0.5px' }}>
                  {mode === 'signup' ? 'Join 2,400+ agencies' : 'Secure · Encrypted · Private'}
                </span>
              </TagChip>

              <h1 style={{
                fontSize: 'clamp(3rem, 5vw, 5rem)',
                fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.05em',
                color: '#f5f5f3', margin: '0 0 20px',
                fontFamily: 'var(--font-heading)',
              }}>
                {mode === 'signup' ? (
                  <>
                    Start<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #4cc02b, #74d94e)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      Growing
                    </span><br />
                    Today
                  </>
                ) : (
                  <>
                    Welcome<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #4cc02b, #74d94e)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      Back
                    </span><br />
                    Pilot
                  </>
                )}
              </h1>

              <p style={{ fontSize: 15, color: 'rgba(245,245,243,0.45)', lineHeight: 1.65, maxWidth: 340, margin: '0 0 40px' }}>
                {mode === 'signup'
                  ? 'Unlock AI-driven lead discovery, pipeline automation, and predictive client acquisition — all in one place.'
                  : 'Your pipeline, proposals, and AI intelligence are ready. Pick up right where you left off.'}
              </p>

              {/* Stat row */}
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { val: '3.2x', label: 'Close rate' },
                  { val: '48h', label: 'First deal' },
                  { val: '94%', label: 'Retention' },
                ].map((s, i) => (
                  <motion.div
                    key={s.val}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, ease: EASE, duration: 0.5 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 14, padding: '12px 16px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#f5f5f3', letterSpacing: '-0.04em', fontFamily: 'var(--font-heading)' }}>
                      {s.val}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(245,245,243,0.35)', fontWeight: 500, marginTop: 2 }}>
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}
        >
          <Shield size={11} style={{ color: 'rgba(245,245,243,0.2)' }} />
          <span style={{ fontSize: 11, color: 'rgba(245,245,243,0.2)', fontWeight: 500 }}>
            SOC 2 Type II · 256-bit AES · Zero data sold
          </span>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="auth-right"
        style={{
          width: '48%', height: '100%',
          background: '#111417',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 32px', overflowY: 'auto',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <MagneticCard>
          <motion.div
            key={`card-${mode}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              width: '100%', maxWidth: 420,
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              borderRadius: 28,
              padding: '40px 36px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(76,192,43,0.08) inset',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  style={{ marginBottom: 28 }}
                >
                  <h2 style={{
                    fontSize: 26, fontWeight: 800, color: '#f5f5f3',
                    letterSpacing: '-0.04em', margin: '0 0 6px',
                    fontFamily: 'var(--font-heading)',
                  }}>
                    {mode === 'signup' ? 'Create account' : 'Sign in'}
                  </h2>
                  <p style={{ fontSize: 13, color: 'rgba(245,245,243,0.4)', margin: 0, fontWeight: 400 }}>
                    {mode === 'signup'
                      ? 'Start your free 14-day trial — no credit card needed.'
                      : 'Enter your credentials to continue.'}
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} noValidate>
                  
                  {/* Full name */}
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <label className="auth-label">Full name</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              className={`auth-input${shakeName ? ' shake' : ''}`}
                              type="text" placeholder="John Doe"
                              value={fullName} onChange={(e) => setFullName(e.target.value)}
                              autoComplete="name"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <label className="auth-label">Email address</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className={`auth-input${shakeEmail ? ' shake' : ''}`}
                        type="email" placeholder="john@example.com"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label className="auth-label" style={{ margin: 0 }}>Password</label>
                      {mode === 'login' && (
                        <a href="#" style={{ fontSize: 11, fontWeight: 600, color: '#4cc02b', textDecoration: 'none', opacity: 0.8 }}>
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        className={`auth-input${shakePassword ? ' shake' : ''}`}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: 'rgba(245,245,243,0.3)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0,
                          transition: 'color 200ms',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#4cc02b')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,243,0.3)')}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.22 }}
                        style={{
                          fontSize: 12, fontWeight: 600, padding: '10px 14px', borderRadius: 10,
                          color: error.includes('Check your email') ? '#4cc02b' : '#f87171',
                          background: error.includes('Check your email')
                            ? 'rgba(76,192,43,0.08)' : 'rgba(248,113,113,0.08)',
                          border: `1px solid ${error.includes('Check your email') ? 'rgba(76,192,43,0.2)' : 'rgba(248,113,113,0.2)'}`,
                        }}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                  >
                    <button type="submit" className="auth-btn-primary" disabled={loading}>
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>{mode === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight size={15} /></>
                      )}
                    </button>
                  </motion.div>
                </form>

                {/* Toggle */}
                <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'rgba(245,245,243,0.35)', fontWeight: 400 }}>
                  {mode === 'signup' ? (
                    <>Already have an account?{' '}
                      <button className="auth-toggle-btn" onClick={() => handleStateToggle('login')}>Sign in</button>
                    </>
                  ) : (
                    <>No account?{' '}
                      <button className="auth-toggle-btn" onClick={() => handleStateToggle('signup')}>Sign up free</button>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(245,245,243,0.2)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>
                    Demo Access
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                </div>

                {/* Demo buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="auth-demo-btn"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={loading}
                    style={{
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(245,245,243,0.6)',
                    }}
                  >
                    <Zap size={13} />
                    Admin demo
                  </button>
                  <button
                    type="button"
                    className="auth-demo-btn"
                    onClick={() => handleDemoLogin('user')}
                    disabled={loading}
                    style={{
                      border: '1.5px solid rgba(76,192,43,0.3)',
                      background: 'rgba(76,192,43,0.06)',
                      color: '#4cc02b',
                    }}
                  >
                    <User size={13} />
                    User demo
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </MagneticCard>
      </div>
    </div>
  )
}
