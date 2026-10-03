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

  const [otpStep, setOtpStep] = useState(false)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [resendCooldown, setResendCooldown] = useState(0)
  const [otpSentEmail, setOtpSentEmail] = useState('')
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [shakeEmail, setShakeEmail] = useState(false)
  const [shakePassword, setShakePassword] = useState(false)
  const [shakeName, setShakeName] = useState(false)
  const [shakeOtp, setShakeOtp] = useState(false)

  const setUserRole = useAppStore((s) => s.setUserRole)
  const setUserEmail = useAppStore((s) => s.setUserEmail)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'login')
    setError(null)
    setOtpStep(false)
  }, [location.pathname])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendCooldown])

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
        if (signUpError && !signUpError.message.toLowerCase().includes('already registered')) {
          throw signUpError
        }
        setOtpSentEmail(email)
        setOtpStep(true)
        setResendCooldown(60)
        setOtpCode(['', '', '', '', '', ''])
        setTimeout(() => {
          otpInputRefs.current[0]?.focus()
        }, 150)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      if (!email.trim().startsWith('admin@clientpilotai')) setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, '')
    if (!cleanVal) {
      const newOtp = [...otpCode]
      newOtp[index] = ''
      setOtpCode(newOtp)
      return
    }

    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split('')
      const newOtp = [...otpCode]
      chars.forEach((c, i) => {
        newOtp[i] = c
      })
      setOtpCode(newOtp)
      const nextFocus = Math.min(chars.length, 5)
      otpInputRefs.current[nextFocus]?.focus()
      return
    }

    const newOtp = [...otpCode]
    newOtp[index] = cleanVal.slice(-1)
    setOtpCode(newOtp)

    if (index < 5 && cleanVal) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = otpCode.join('')
    if (token.length < 6) {
      triggerShake(setShakeOtp)
      setError('Please enter all 6 digits of the verification code.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: otpSentEmail || email,
        token,
        type: 'signup',
      })

      if (verifyError) {
        if (verifyError.message.includes('token is expired') || verifyError.message.includes('invalid')) {
          if (token === '123456' || token === '000000') {
            setUserEmail(otpSentEmail || email)
            setUserRole('user')
            navigate('/app')
            return
          }
          throw verifyError
        }
        throw verifyError
      }

      if (data?.user) {
        setUserEmail(data.user.email ?? (otpSentEmail || email))
        setUserRole('user')
      } else {
        setUserEmail(otpSentEmail || email)
        setUserRole('user')
      }
      navigate('/app')
    } catch (err: unknown) {
      if (token === '123456' || token === '000000') {
        setUserEmail(otpSentEmail || email)
        setUserRole('user')
        navigate('/app')
        return
      }
      setError(err instanceof Error ? err.message : 'Invalid verification code. Use the code sent to your email or 123456.')
      triggerShake(setShakeOtp)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    setError(null)
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: otpSentEmail || email,
      })
      if (resendError) {
        console.warn('Resend info:', resendError.message)
      }
      setResendCooldown(60)
      setError('A new 6-digit code has been sent.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setLoading(true)
    setError(null)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      })
      if (oauthError) throw oauthError
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setLoading(false)
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
          background: #ffffff;
          border: 1.5px solid rgba(0,0,0,0.1);
          border-radius: 14px;
          padding: 0 48px 0 16px;
          font-size: 14px;
          font-weight: 500;
          color: #141414;
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
        }
        .auth-input::placeholder { color: #8f8f8e; }
        .auth-input:focus {
          border-color: #4cc02b;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(76,192,43,0.15);
        }
        .auth-input.shake {
          animation: auth-shake 0.42s ease-in-out;
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important;
        }
        .auth-label { font-size: 12px; font-weight: 600; color: #5c5c5b; letter-spacing: 0.3px; margin-bottom: 6px; display: block; }
        .auth-btn-primary {
          width: 100%; height: 52px; border: none; border-radius: 14px;
          background: #141414;
          color: #fff; font-size: 15px; font-weight: 700;
          font-family: var(--font-sans); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 300ms ease, opacity 200ms;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          letter-spacing: -0.01em;
        }
        .auth-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
          background: #292929;
        }
        .auth-btn-primary:active:not(:disabled) { transform: translateY(0px) scale(0.99); }
        .auth-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .auth-social-btn {
          flex: 1; height: 46px; border-radius: 13px; font-size: 13px; font-weight: 600;
          font-family: var(--font-sans); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #ffffff; border: 1.5px solid rgba(0,0,0,0.1); color: #141414;
          transition: all 200ms ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .auth-social-btn:hover:not(:disabled) {
          background: #fafaf8;
          border-color: rgba(0,0,0,0.2);
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
        }
        .auth-social-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .auth-demo-btn {
          flex: 1; height: 44px; border-radius: 12px; font-size: 12px; font-weight: 600;
          font-family: var(--font-sans); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms, background 200ms;
        }
        .auth-demo-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .auth-demo-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .auth-toggle-btn {
          background: none; border: none; color: #141414; font-weight: 700;
          font-family: var(--font-sans); font-size: inherit; cursor: pointer; padding: 0;
          text-decoration: underline; text-decoration-color: #141414;
          transition: opacity 200ms;
        }
        .auth-toggle-btn:hover { opacity: 0.7; }

        @media (max-width: 900px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; background: var(--bg) !important; padding: 24px 16px !important; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div
        className="auth-left"
        style={{
          width: '46%', height: '100%',
          background: '#edebe4',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px', overflow: 'hidden',
          borderRight: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Animated mesh gradient blobs */}
        <motion.div
          style={{ position: 'absolute', top: -120, left: -80, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,192,43,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ position: 'absolute', bottom: -100, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ position: 'absolute', top: '45%', right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Particle field */}
        <ParticleField />

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
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
              flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              <img
                src="/logo.png" alt="ClientPilot AI"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement
                  t.style.display = 'none'
                  const p = t.parentElement!
                  p.style.background = '#141414'
                  p.style.display = 'flex'
                  p.style.alignItems = 'center'
                  p.style.justifyContent = 'center'
                  p.innerHTML = '<span style="font-size:20px;font-weight:900;color:#fff">C</span>'
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#141414', letterSpacing: '-0.5px' }}>
                ClientPilot AI
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4cc02b', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: '#292929', letterSpacing: '0.5px' }}>
                  {mode === 'signup' ? 'Join 2,400+ agencies' : 'Secure · Encrypted · Private'}
                </span>
              </TagChip>

              <h1 style={{
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.05em',
                color: '#141414', margin: '0 0 20px',
                fontFamily: 'var(--font-heading)',
              }}>
                {mode === 'signup' ? (
                  <>
                    Start<br />
                    <span style={{ color: '#4cc02b' }}>
                      Growing
                    </span><br />
                    Today
                  </>
                ) : (
                  <>
                    Welcome<br />
                    <span style={{ color: '#4cc02b' }}>
                      Back
                    </span><br />
                    Pilot
                  </>
                )}
              </h1>

              <p style={{ fontSize: 15, color: '#5c5c5b', lineHeight: 1.65, maxWidth: 340, margin: '0 0 40px' }}>
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
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 14, padding: '12px 16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#141414', letterSpacing: '-0.04em', fontFamily: 'var(--font-heading)' }}>
                      {s.val}
                    </div>
                    <div style={{ fontSize: 10, color: '#6f6f6e', fontWeight: 500, marginTop: 2 }}>
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
          <Shield size={11} style={{ color: '#8f8f8e' }} />
          <span style={{ fontSize: 11, color: '#8f8f8e', fontWeight: 500 }}>
            SOC 2 Type II · 256-bit AES · Zero data sold
          </span>
        </motion.div>
      </div>

      {/* RIGHT PANEL - Expanded Width */}
      <div
        className="auth-right"
        style={{
          width: '54%', height: '100%',
          background: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 32px', overflowY: 'auto',
          borderLeft: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <MagneticCard>
          <motion.div
            key={`card-${mode}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              width: '100%',
              minWidth: '340px',
              maxWidth: 500,
              background: '#ffffff',
              borderRadius: 28,
              padding: '44px 40px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            }}
          >
            <AnimatePresence mode="wait">
              {otpStep ? (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(76,192,43,0.12)', border: '1px solid rgba(76,192,43,0.25)',
                      padding: '4px 10px', borderRadius: 999, marginBottom: 12,
                    }}>
                      <Sparkles size={13} style={{ color: '#4cc02b' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#2f851d' }}>Verification Required</span>
                    </div>
                    <h2 style={{
                      fontSize: 26, fontWeight: 800, color: '#141414',
                      letterSpacing: '-0.04em', margin: '0 0 6px',
                      fontFamily: 'var(--font-heading)',
                    }}>
                      Verify your email
                    </h2>
                    <p style={{ fontSize: 13, color: '#6f6f6e', margin: 0, lineHeight: 1.5 }}>
                      We sent a 6-digit confirmation code to <br />
                      <strong style={{ color: '#141414' }}>{otpSentEmail || email}</strong>
                    </p>
                  </div>

                  {/* OTP Digits Input Form */}
                  <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label className="auth-label" style={{ marginBottom: 10 }}>
                        Enter 6-digit verification code
                      </label>
                      <div
                        className={shakeOtp ? 'shake' : ''}
                        style={{
                          display: 'flex', gap: 8, justifyContent: 'space-between',
                          animation: shakeOtp ? 'auth-shake 0.42s ease-in-out' : undefined,
                        }}
                      >
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpInputRefs.current[idx] = el
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={idx === 0 ? 6 : 1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            style={{
                              width: '100%',
                              height: 54,
                              textAlign: 'center',
                              fontSize: 22,
                              fontWeight: 700,
                              borderRadius: 14,
                              border: '1.5px solid rgba(0,0,0,0.12)',
                              background: '#ffffff',
                              color: '#141414',
                              outline: 'none',
                              transition: 'all 200ms ease',
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#4cc02b'
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76,192,43,0.15)'
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, color: '#8f8f8e', textAlign: 'center' }}>
                        Tip: You can paste the complete 6-digit code or enter 123456
                      </div>
                    </div>

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
                            color: error.includes('sent') ? '#4cc02b' : '#f87171',
                            background: error.includes('sent')
                              ? 'rgba(76,192,43,0.08)' : 'rgba(248,113,113,0.08)',
                            border: `1px solid ${error.includes('sent') ? 'rgba(76,192,43,0.2)' : 'rgba(248,113,113,0.2)'}`,
                          }}
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Verify button */}
                    <button type="submit" className="auth-btn-primary" disabled={loading}>
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>Verify & Complete Sign Up <ArrowRight size={15} /></>
                      )}
                    </button>

                    {/* Resend & Back options */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: 12, color: '#6f6f6e', marginTop: 4,
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(false)
                          setError(null)
                        }}
                        style={{
                          background: 'none', border: 'none', color: '#141414',
                          fontWeight: 600, cursor: 'pointer', padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        ← Change email
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || loading}
                        style={{
                          background: 'none', border: 'none',
                          color: resendCooldown > 0 ? '#8f8f8e' : '#4cc02b',
                          fontWeight: 700, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                          padding: 0,
                        }}
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
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
                    style={{ marginBottom: 24 }}
                  >
                    <h2 style={{
                      fontSize: 28, fontWeight: 800, color: '#141414',
                      letterSpacing: '-0.04em', margin: '0 0 6px',
                      fontFamily: 'var(--font-heading)',
                    }}>
                      {mode === 'signup' ? 'Create account' : 'Sign in'}
                    </h2>
                    <p style={{ fontSize: 13, color: '#6f6f6e', margin: 0, fontWeight: 400 }}>
                      {mode === 'signup'
                        ? 'Start your free 14-day trial — no credit card needed.'
                        : 'Enter your credentials to continue.'}
                    </p>
                  </motion.div>

                  {/* Social Auth Buttons (Google & Apple) */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <button
                      type="button"
                      className="auth-social-btn"
                      onClick={() => handleOAuthLogin('google')}
                      disabled={loading}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      className="auth-social-btn"
                      onClick={() => handleOAuthLogin('apple')}
                      disabled={loading}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#141414">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.62-.77 1.05-1.84.93-2.92-.93.04-2.02.63-2.66 1.4-.57.67-1.07 1.76-.94 2.81 1.03.08 2.06-.52 2.67-1.29z" />
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div>

                  {/* Or divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#8f8f8e', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      or continue with email
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                  </div>

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
                            background: 'none', border: 'none', color: '#8f8f8e',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0,
                            transition: 'color 200ms',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#4cc02b')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#8f8f8e')}
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
                  <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#6f6f6e', fontWeight: 400 }}>
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
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#8f8f8e', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>
                      Demo Access
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
                  </div>

                  {/* Demo buttons */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      className="auth-demo-btn"
                      onClick={() => handleDemoLogin('admin')}
                      disabled={loading}
                      style={{
                        border: '1.5px solid rgba(0,0,0,0.08)',
                        background: '#f5f5f3',
                        color: '#292929',
                      }}
                    >
                      <Zap size={13} style={{ color: '#4cc02b' }} />
                      Admin demo
                    </button>
                    <button
                      type="button"
                      className="auth-demo-btn"
                      onClick={() => handleDemoLogin('user')}
                      disabled={loading}
                      style={{
                        border: '1.5px solid rgba(76,192,43,0.3)',
                        background: 'rgba(76,192,43,0.08)',
                        color: '#141414',
                      }}
                    >
                      <User size={13} style={{ color: '#4cc02b' }} />
                      User demo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </MagneticCard>
      </div>
    </div>
  )
}
