// components/MarketingNavbar.tsx
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/store/auth-store'

const NAV_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#docs', label: 'Docs' },
  { href: '#changelog', label: 'Changelog' },
]

export function MarketingNavbar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-[var(--marketing-border)] bg-[var(--marketing-bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-2" aria-label="TrueUp home">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--marketing-emerald)] font-bold text-black"
            style={{ letterSpacing: '-0.08em' }}
            aria-hidden="true"
          >
            T
          </span>
          <span className="text-[15px] font-semibold text-[var(--marketing-text)]">
            trueup
          </span>
          <span className="ml-2 rounded border border-[color:rgba(16,185,129,0.3)] bg-[color:rgba(16,185,129,0.1)] px-2 py-0.5 font-mono text-[10px] uppercase text-[var(--marketing-emerald)]">
            FinOps
          </span>
        </Link>

        <nav className="hidden gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[var(--marketing-text-muted)] transition-colors hover:text-[var(--marketing-text)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="max-w-[150px] truncate text-[13px] text-[var(--marketing-text-muted)]">
                {user.email}
              </span>
              <Link
                to="/dashboard"
                className="font-mono text-xs uppercase text-[var(--marketing-text-muted)] transition-colors hover:text-[var(--marketing-text)]"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="h-11 rounded-md border-2 border-white/20 px-6 font-mono text-xs font-bold uppercase tracking-wider text-[var(--marketing-text)] transition-all hover:border-white/40 hover:bg-white/[0.04]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-mono text-xs uppercase text-[var(--marketing-text-muted)] transition-colors hover:text-[var(--marketing-text)]"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex h-11 items-center rounded-md bg-[var(--marketing-emerald)] px-6 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.97]"
                style={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 24px -6px var(--marketing-emerald-glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}