import { Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'

// StudioShell ships in Batches 1-4 (default export) and should already exist on disk.
import StudioShell from '@/studio/StudioShell'

/**
 * Minimal error boundary. Batch 7 formalizes a shared ErrorBoundary with
 * richer reporting/a11y — this local version keeps Batch 5 self-contained
 * until that lands.
 */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('TrueUp render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen items-center justify-center bg-[var(--marketing-bg)] px-8 text-center"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--marketing-rose)]">
              Something broke
            </p>
            <p className="mt-3 text-[var(--marketing-text-muted)]">
              Refresh the page to try again.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
}



function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...pageTransition}>
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition}>
              <LoginPage />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div {...pageTransition}>
              <SignupPage />
            </motion.div>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <motion.div {...pageTransition}>
                <DashboardPage />
              </motion.div>
            }
          />
          <Route
            path="/studio"
            element={
              <motion.div {...pageTransition}>
                <StudioShell />
              </motion.div>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}