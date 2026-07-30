import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const STORAGE_KEY = 'trueup-auth'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface AuthUser {
  email: string
  name: string
}

interface StoredAuth {
  user: AuthUser
}

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  signup: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

function readStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredAuth
    if (parsed && typeof parsed.user?.email === 'string') return parsed
    return null
  } catch {
    return null
  }
}

function writeStoredAuth(user: AuthUser): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }))
  } catch {
    // localStorage may be unavailable (private mode, quota); fail silently.
  }
}

function clearStoredAuth(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // no-op
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const initialStored = readStoredAuth()

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: Boolean(initialStored),
      user: initialStored?.user ?? null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null }, false, 'auth/login/start')

        await wait(800)

        if (!EMAIL_RE.test(email) || password.length < 6) {
          set(
            { isLoading: false, error: 'Invalid credentials or password too short' },
            false,
            'auth/login/error'
          )
          return
        }

        const user: AuthUser = { email, name: email.split('@')[0] }
        writeStoredAuth(user)
        set(
          { isAuthenticated: true, user, isLoading: false, error: null },
          false,
          'auth/login/success'
        )
      },

      signup: async (email, name, password) => {
        set({ isLoading: true, error: null }, false, 'auth/signup/start')

        await wait(800)

        if (!EMAIL_RE.test(email) || password.length < 6 || name.trim().length < 2) {
          set(
            { isLoading: false, error: 'Invalid credentials or password too short' },
            false,
            'auth/signup/error'
          )
          return
        }

        const user: AuthUser = { email, name: name.trim() }
        writeStoredAuth(user)
        set(
          { isAuthenticated: true, user, isLoading: false, error: null },
          false,
          'auth/signup/success'
        )
      },

      logout: () => {
        clearStoredAuth()
        set(
          { isAuthenticated: false, user: null, isLoading: false, error: null },
          false,
          'auth/logout'
        )
      },

      clearError: () => set({ error: null }, false, 'auth/clearError'),
    }),
    { name: 'trueup-auth-store' }
  )
)