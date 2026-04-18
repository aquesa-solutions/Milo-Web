import type { Metadata } from 'next'
import Link from 'next/link'
import ForgotPasswordForm from '@/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Request a password reset link for your Milo account.',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-24">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
              <path d="M13 7H1M7 1L1 7l6 6" />
            </svg>
            Back to login
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Reset your password</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Enter your account email and we will send you a secure reset link.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}
