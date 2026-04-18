import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Milo account.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-24">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
              <path d="M13 7H1M7 1L1 7l6 6" />
            </svg>
            Back to platform
          </Link>

          <div className="mb-6 flex rounded-full border border-[var(--border)] p-1">
            <Link
              href="/login"
              className="flex-1 rounded-full bg-[var(--text)] px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--bg)]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              Register
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Sign in to access your dashboard.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
