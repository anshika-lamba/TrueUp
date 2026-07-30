import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { useAuthStore } from '@/store/auth-store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clearError = useAuthStore((s) => s.clearError)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    return () => { clearError() }
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--marketing-bg)] px-8">
      <div className="w-full max-w-[420px]">

        {/* Logo + header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--marketing-emerald)]">
            <span
              className="font-bold text-black text-lg"
              style={{ letterSpacing: '-0.08em' }}
            >
              T
            </span>
          </div>
          <h1
            className="mt-6 text-[32px] font-semibold text-[var(--marketing-text)]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Sign in to trueup
          </h1>
          <p className="mt-2 text-sm text-[var(--marketing-text-muted)]">
            New here?{' '}
            <Link
              to="/signup"
              className="text-[var(--marketing-emerald)] transition-colors hover:text-emerald-400"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-11 w-full rounded-md border border-[var(--marketing-border)] bg-[var(--marketing-panel)] px-4 text-[var(--marketing-text)] placeholder-[var(--marketing-text-subtle)] outline-none transition-all duration-150 focus:border-[var(--marketing-emerald)] focus:ring-2 focus:ring-[color:rgba(16,185,129,0.2)]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-md border border-[var(--marketing-border)] bg-[var(--marketing-panel)] px-4 text-[var(--marketing-text)] placeholder-[var(--marketing-text-subtle)] outline-none transition-all duration-150 focus:border-[var(--marketing-emerald)] focus:ring-2 focus:ring-[color:rgba(16,185,129,0.2)]"
            />
            <p className="mt-1 text-xs text-[var(--marketing-text-subtle)]">6+ characters</p>
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="login-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2 rounded-md border border-[color:rgba(244,63,94,0.3)] bg-[color:rgba(244,63,94,0.1)] p-3 text-sm text-[var(--marketing-rose)]"
                role="alert"
              >
                <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-md bg-[var(--marketing-emerald)] font-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-150 hover:bg-emerald-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--marketing-border)]" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
            or
          </span>
          <div className="h-px flex-1 bg-[var(--marketing-border)]" />
        </div>

        {/* Guest button */}
        <button
          id="login-guest"
          type="button"
          onClick={() => navigate('/studio')}
          className="h-11 w-full rounded-md border-2 border-[var(--marketing-border)] bg-transparent font-mono text-xs font-bold uppercase tracking-wider text-[var(--marketing-text)] transition-all hover:border-[var(--marketing-border-strong)]"
        >
          Continue as guest
        </button>

        {/* Legal */}
        <p className="mt-8 text-center text-xs text-[var(--marketing-text-subtle)]">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
