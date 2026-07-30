import { Navigate, useLocation, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/store/auth-store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-[var(--marketing-bg)]"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--marketing-border)] border-t-[var(--marketing-emerald)]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--marketing-text)]">
            Verifying session...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}