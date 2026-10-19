import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowLeft,
  Server
} from 'lucide-react'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const setAuthToken = useAppStore((s) => s.setAuthToken)
  const setUserRole = useAppStore((s) => s.setUserRole)
  const setUserEmail = useAppStore((s) => s.setUserEmail)

  const [identifier, setIdentifier] = useState('admin@clientpilot.ai')
  const [password, setPassword] = useState('Admin@ClientPilot2026!')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      setError('Please provide both administrator identifier and password.')
      return
    }

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

      const response = await fetch(`${rawApiUrl}/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Invalid administrator credentials. Access restricted.')
      }

      // Persist admin session
      setAuthToken(data.token)
      setUserRole('admin')
      setUserEmail(data.user?.email || identifier.trim())
      setSuccess(true)

      // Direct redirection to the administrator workspace
      setTimeout(() => {
        navigate('/app/admin')
      }, 400)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Administrative authentication failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickFill = () => {
    setIdentifier('admin@clientpilot.ai')
    setPassword('Admin@ClientPilot2026!')
    setError(null)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#F5F7F5',
        color: '#101010',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '680px',
          height: '680px',
          background: 'radial-gradient(circle, rgba(74,195,41,0.08) 0%, rgba(221,231,208,0.2) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Return Navigation */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#676864',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid #B2DCA0',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#101010'
            e.currentTarget.style.borderColor = '#4AC329'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#676864'
            e.currentTarget.style.borderColor = '#B2DCA0'
          }}
        >
          <ArrowLeft size={14} />
          Back to ClientPilot
        </Link>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            color: '#676864',
            background: '#DDE7D0',
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #B2DCA0',
          }}
        >
          v2.4.0 · ADMIN_AUTH
        </span>
      </div>

      {/* Main Admin Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px 32px',
          border: '1px solid #B2DCA0',
          boxShadow: '0 20px 48px -12px rgba(16,16,16,0.08), 0 1px 3px rgba(16,16,16,0.04)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Admin Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#DDE7D0',
              border: '1.5px solid #B2DCA0',
              marginBottom: '14px',
              boxShadow: '0 4px 12px rgba(74,195,41,0.15)',
            }}
          >
            <ShieldCheck size={28} color="#206312" strokeWidth={2.2} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#DDE7D0',
              border: '1px solid #B2DCA0',
              color: '#206312',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 10px',
              borderRadius: '999px',
              marginBottom: '10px',
            }}
          >
            <Lock size={12} />
            Restricted Admin Portal
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#101010',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            System Administrator Login
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: '#676864',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Direct administrative access. No registration or signup required.
          </p>
        </div>

        {/* Informational Callout */}
        <div
          style={{
            background: '#F7F6F6',
            border: '1px solid #B2DCA0',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <Server size={18} color="#4AC329" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '12px', color: '#676864', lineHeight: 1.45 }}>
            <strong style={{ color: '#101010', display: 'block', marginBottom: '2px' }}>
              Root Control Access
            </strong>
            Pre-configured governance account with elevated permissions. Enter credentials to unlock administrative controls.
          </div>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#991B1B',
                fontSize: '13px',
                overflow: 'hidden',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, lineHeight: 1.4 }}>{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Feedback */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#DDE7D0',
                border: '1px solid #B2DCA0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#206312',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '18px',
              }}
            >
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <div>Authenticated! Entering Admin Control Center...</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="admin-identifier"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: '#101010',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Admin Identifier / Email
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#676864',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Mail size={16} />
              </div>
              <input
                id="admin-identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@clientpilot.ai or admin"
                disabled={loading || success}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px 0 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #B2DCA0',
                  background: '#F7F6F6',
                  color: '#101010',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4AC329'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,195,41,0.18)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#B2DCA0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="admin-password"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#101010',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Admin Security Password
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#206312',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={11} color="#4AC329" />
                Fill Default
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#676864',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <KeyRound size={16} />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={loading || success}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 44px 0 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #B2DCA0',
                  background: '#F7F6F6',
                  color: '#101010',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4AC329'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,195,41,0.18)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#B2DCA0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#676864',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            style={{
              marginTop: '8px',
              width: '100%',
              height: '48px',
              borderRadius: '12px',
              background: '#101010',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading || success ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(16,16,16,0.18)',
              transition: 'all 0.2s ease',
              opacity: loading || success ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading && !success) {
                e.currentTarget.style.background = '#222222'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !success) {
                e.currentTarget.style.background = '#101010'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                Authenticate Administrator
                <ArrowRight size={16} color="#4AC329" />
              </>
            )}
          </button>
        </form>

        {/* Footer info: Strictly No Signup */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#676864', marginBottom: '8px' }}>
            Looking for regular agency login?{' '}
            <Link
              to="/login"
              style={{
                color: '#101010',
                fontWeight: 700,
                textDecoration: 'underline',
                textDecorationColor: '#4AC329',
              }}
            >
              Standard Sign In
            </Link>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#676864',
              fontStyle: 'italic',
            }}
          >
            Administrative accounts are managed directly. No public registration permitted.
          </div>
        </div>
      </motion.div>
    </div>
  )
}
