import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans flex flex-col justify-between selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />

      <main className="py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="p-8 rounded-[12px] bg-white border border-black/10 text-left space-y-6 shadow-sm">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-normal text-[#292929] font-heading">Reset your password.</h1>
              <p className="text-xs text-[#6f6f6e]">Enter your account email to receive a password reset link.</p>
            </div>

            {status === 'success' ? (
              <div className="p-4 rounded-[6px] bg-[#dbdbd2] text-[#292929] text-xs space-y-2">
                <div className="flex items-center gap-2 font-normal"><CheckCircle2 className="w-4 h-4 text-[#4cc02b]" /> Email Sent</div>
                <p>If an account exists for {email}, a password reset link has been dispatched to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@agency.com"
                    className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-[44px] rounded-[200px] bg-[#141414] hover:bg-[#292929] text-white font-normal text-sm transition-all flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Link</span>}
                </button>
              </form>
            )}

            <div className="text-center pt-2 border-t border-black/10">
              <Link to="/login" className="text-xs font-normal text-[#6f6f6e] hover:text-[#292929] transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans flex flex-col justify-between">
      <PublicNavbar />

      <main className="py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="p-8 rounded-[12px] bg-white border border-black/10 text-left space-y-6 shadow-sm">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-normal text-[#292929] font-heading">Set new password</h1>
              <p className="text-xs text-[#6f6f6e]">Choose a secure password for your ClientPilot workspace.</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-[6px] bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {status === 'success' ? (
              <div className="p-4 rounded-[6px] bg-[#dbdbd2] text-[#292929] text-xs space-y-3">
                <div className="flex items-center gap-2 font-normal"><CheckCircle2 className="w-4 h-4 text-[#4cc02b]" /> Password Reset Complete</div>
                <p>Your password has been updated successfully.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 rounded-[200px] bg-[#141414] text-white font-normal"
                >
                  Sign In Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-normal text-[#6f6f6e] mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-[44px] rounded-[200px] bg-[#141414] hover:bg-[#292929] text-white font-normal text-sm transition-all flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Reset Password</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}

export function VerifyEmailPage() {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const navigate = useNavigate()

  const handleResend = () => {
    setResending(true)
    setTimeout(() => {
      setResending(false)
      setResent(true)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans flex flex-col justify-between">
      <PublicNavbar />

      <main className="py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="p-8 rounded-[12px] bg-white border border-black/10 text-center space-y-6 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#c0c0c0] flex items-center justify-center text-[#353535] mx-auto">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-normal text-[#292929] font-heading">Verify your email.</h1>
              <p className="text-xs text-[#6f6f6e]">Check your inbox for the verification link sent to your registered address.</p>
            </div>

            {resent && (
              <div className="p-3.5 rounded-[6px] bg-[#dbdbd2] text-[#292929] text-xs">
                Verification email resent. Please check your spam folder if you don't see it.
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => navigate('/app')}
                className="w-full h-[44px] rounded-[200px] bg-[#141414] hover:bg-[#292929] text-white font-normal text-sm"
              >
                Continue After Verification
              </button>

              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full h-[44px] rounded-[200px] bg-[#dbdbd2] text-[#292929] text-xs font-normal hover:bg-[#d0d0c8]"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
