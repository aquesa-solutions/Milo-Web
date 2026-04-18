'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { requestPasswordResetAction, type AuthActionState } from '@/app/auth-actions'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    requestPasswordResetAction,
    { error: null, message: null }
  )

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="label mb-1.5 block">
          Account email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="input-field"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isPending}
          required
        />
      </div>

      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {state.message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Sending...' : 'Send reset link'}
      </button>

      <p className="pt-2 text-center text-xs text-[var(--text-dim)]">
        Remembered your password?{' '}
        <Link href="/login" className="underline transition-colors hover:text-[var(--text-muted)]">
          Back to login
        </Link>
      </p>
    </form>
  )
}
