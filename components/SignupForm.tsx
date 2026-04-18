'use client'

import React, { useEffect, useState } from 'react'
import PasswordValidator from 'password-validator'
import { useSearchParams } from 'next/navigation'

import Link from 'next/link'
import passwordHasher from "@/lib/passwordHasher";
import {fetchPackagePriceById} from "@/lib/packages";

type roleState = 'builder' | 'devops'

interface FormState {
  name: string
  email: string
  password: string
  organization: string
}


interface RoleMeta {
  label: string
  price: string
  color: string
}

interface Role {
  builder: RoleMeta
  devops: RoleMeta
}

interface SignUpFormProps {
  ROLE_META: Role
}

const SignupForm = ({ROLE_META}: SignUpFormProps) => {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const initialRole: roleState = roleParam === 'devops' ? 'devops' : 'builder'

  const [role, setRole] = useState<roleState>(initialRole)

  useEffect(() => {
    setRole(roleParam === 'devops' ? 'devops' : 'builder')
  }, [roleParam])

  if(ROLE_META === null)
    return (
      <div>
        Error fetching role metadata
      </div>
    )

  const meta = ROLE_META[role]
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    organization: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (role === 'builder' && !form.organization.trim()) {
      setError('Organisation is required for Builder accounts.')
      return
    }

    const password = form.password
    const schema = new PasswordValidator()
    schema
      .is().min(8)
      .is().max(100)
      .has().uppercase(1)
      .has().lowercase(1)
      .has().digits(1)
      .has().symbols(1)
      .has().not().spaces()
      .is().not().oneOf(['Password123', 'Admin123', 'admin123', 'admin', 'password']);


    if (schema.validate(password) !== true) {
      setError(`Password must be at least 8 characters, contain at least one uppercase letter, 
      one lowercase letter, one digit, and one symbol, and cannot contain spaces or special characters.`)

      return
    }

    setLoading(true)

    try {
      const result = await passwordHasher(
        password
      )

      if(!result.ok)
        throw "Error hashing password:"

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: result.password,
          organization: form.organization.trim(),
          role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // Redirect to PayPal approval
      window.location.href = data.url

    } catch(error) {
      console.error('Error creating checkout session:', error)

      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Role selector */}
      <div className="card mb-6">
        <span className="label">Choose your plan</span>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(Object.keys(ROLE_META) as roleState[]).map((option) => {
            const isActive = role === option
            const optionMeta = ROLE_META[option]

            return (
              <button
                key={option}
                type="button"
                onClick={() => setRole(option)}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  isActive
                    ? 'border-[var(--text)] bg-[var(--surface-2)]'
                    : 'border-[var(--border-light)] hover:border-[var(--border)]'
                }`}>
                <p className="text-sm font-semibold text-[var(--text)]">{optionMeta.label}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{optionMeta.price}</p>
              </button>
            )
          })}
        </div>
        <div className="mt-3 text-right">
          <span className="label">Selected plan</span>
          <p className={`mt-1 text-sm font-semibold text-black`}>{meta.label}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div>
          <label htmlFor="name" className="label mb-1.5 block">
            Full name <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            required
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="label mb-1.5 block">
            Work email <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@company.com"
            value={form.email}
            onChange={handleChange}
            className="input-field"
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="label mb-1.5 block">
            Password <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className="input-field"
            required
            disabled={loading}
          />
          <p className="mt-1 text-xs text-[var(--text-dim)]">
            Must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one symbol.
          </p>
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="organization" className="label mb-1.5 block">
            Organisation{' '}
            {role === 'builder' ? (
              <span className="text-[var(--accent)]">*</span>
            ) : (
              <span className="text-[var(--text-dim)]">(optional)</span>
            )}
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            placeholder={role === 'builder' ? 'Acme Inc.' : 'Freelance / company name'}
            value={form.organization}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Redirecting to checkout…
            </>
          ) : (
            <>
              Continue to payment
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                <path d="M1 7h12M7 1l6 6-6 6" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-[var(--text-dim)]">
        Your account will be created after payment is confirmed. We activate it after few further confirmations from our end. {' '}
        <Link href="/pricing" className="underline hover:text-[var(--text-muted)] transition-colors">
          View pricing details
        </Link>
      </p>
    </div>
  )
}

export default SignupForm