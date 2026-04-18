import type { Metadata } from 'next'
import Link from 'next/link'
import ResetPasswordForm from '@/components/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Set new password',
  description: 'Set a new password for your Milo account.',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
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

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Set a new password</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Choose a strong password to secure your account.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  )
}
