'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { updatePasswordAction, type AuthActionState } from '@/app/auth-actions'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    updatePasswordAction,
    { error: null, message: null }
  )

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <label htmlFor="password" className="label mb-1.5 block">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="input-field"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label mb-1.5 block">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="input-field"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
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
        {isPending ? 'Updating...' : 'Update password'}
      </button>

      <p className="pt-2 text-center text-xs text-[var(--text-dim)]">
        Back to{' '}
        <Link href="/login" className="underline transition-colors hover:text-[var(--text-muted)]">
          login
        </Link>
      </p>
    </form>
  )
}
