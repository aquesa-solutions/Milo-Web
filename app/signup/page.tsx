import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import SignupForm from '@/components/SignupForm'
import {fetchPackagePriceById} from "@/lib/packages";

export const metadata: Metadata = {
  title: 'Get started',
  description: 'Create your Milo account. Choose your role and complete payment to get started.',
  robots: { index: false, follow: false },
}

const roles_builder = async () => {
  try {
    const builderResult = await fetchPackagePriceById("builder")
    if(builderResult.error)
      throw "Builder package price fetch failed"

    const devopsResult = await fetchPackagePriceById("devops")
    if(devopsResult.error)
      throw "Devops package price fetch failed"

    return {
      builder: {
        label: 'Builder',
        price: `$${builderResult.price}/month`,
        color: 'text-[var(--accent)]',
      },
      devops: {
        label: 'DevOps Engineer',
        price: `$${devopsResult.price}/month`,
        color: 'text-[var(--text)]',
      }
    }

  } catch(error) {
    console.error('Error fetching role metadata:', error)
    return null
  }
}

export default async function SignupPage() {
  const ROLE_META = await roles_builder()
  if(ROLE_META === null)
    return (
      <div>
        Unable to process your request. Please try again later. INTERNAL_ERR
      </div>
    )

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-8">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
              <path d="M13 7H1M7 1L1 7l6 6" />
            </svg>
            Back to platform
          </Link>

          <div className="mb-6 flex rounded-full border border-[var(--border)] p-1">
            <Link
              href="/login"
              className="flex-1 rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
              Login
            </Link>

            <Link
              href="/signup"
              className="flex-1 rounded-full bg-[var(--text)] px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--bg)]">
              Register
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Enter your details below. Payment is required to activate your account.
          </p>
          <p className="mt-3 text-xs text-[var(--text-dim)]">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-[var(--text-muted)] transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Flow indicator */}
        <div className="flex items-center gap-0 mb-10">
          {[
            { step: '1', label: 'Your details', active: true },
            { step: '2', label: 'Payment', active: false },
            { step: '3', label: 'Access', active: false },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-0 flex-1 last:flex-initial">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-2xs font-semibold border ${
                    item.active
                      ? 'border-[var(--text)] bg-[var(--text)] text-[var(--bg)]'
                      : 'border-[var(--border-light)] text-[var(--text-dim)]'
                  }`}
                >
                  {item.step}
                </div>
                <span
                  className={`text-xs ${item.active ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}`}
                >
                  {item.label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 mx-3 h-px bg-[var(--border)]" />
              )}
            </div>
          ))}
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-[var(--surface)]" />}>
          <SignupForm ROLE_META={ROLE_META} />
        </Suspense>
      </div>
    </div>
  )
}
