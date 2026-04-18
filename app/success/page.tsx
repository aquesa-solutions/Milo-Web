import type { Metadata } from 'next'
import Link from 'next/link'
import {
  capturePayPalOrder,
  extractCaptureId,
  extractPayerId,
  extractPendingSignupId,
} from '@/lib/paypal'
import { finalizePendingSignup } from '@/lib/payment-provisioning'

export const metadata: Metadata = {
  title: 'Payment successful',
  description: 'Your payment was confirmed. Check your email for login credentials.',
  robots: { index: false, follow: false },
}

type SuccessPageProps = {
  searchParams: Promise<{
    token?: string
  }>
}

async function processPayPalOrder(orderId: string): Promise<{
  ok: false,
  message: string
} | {
  ok: true
}> {
  try {
    const order = await capturePayPalOrder(orderId)

    const pendingSignupId = extractPendingSignupId(order)
    if (!pendingSignupId) {
      return {
        ok: false,
        message: 'Hurray! Payment Successful. We are setting up your account now.',
      }
    }

    await finalizePendingSignup({
      pendingSignupId,
      paypalOrderId: order.id,
      paypalCaptureId: extractCaptureId(order),
      paypalPayerId: extractPayerId(order),
    })

    return { ok: true }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { ok: false, message }
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const orderId = params.token

  const paymentResult: { ok: false, message: string } | { ok: true } = orderId
    ? await processPayPalOrder(orderId)
    : { ok: true }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 w-16 h-16 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[var(--accent)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          Hurray! {paymentResult.ok ? 'Payment confirmed' : 'Payment received'}, setup pending
        </h1>

        <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
          { paymentResult.ok
            ? "Your subscription is now active. We've created your account and sent your login credentials to your email address."
            : 'We received your payment, but there was an issue creating your account automatically. We will get back to you as soon as possible. Thank you for choosing us'}
        </p>

        {/* Steps */}
        <div className="mt-10 card text-left space-y-4">
          <span className="label block">What happens next</span>
          {[
            {
              step: '1',
              title: 'Keep an eye on your inbox',
              desc: 'Your account creation confirmation will be sent to your email shortly.',
            },
            {
              step: '2',
              title: 'Sign in to your account',
              desc: 'Use the credentials that you have provided during sign up in the sign in page to access your dashboard.',
            }
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full border border-[var(--border-light)] flex items-center justify-center">
                <span className="text-2xs text-[var(--text-muted)]">{item.step}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-3">
          <Link href="/" className="btn-secondary justify-center text-sm">
            Return to home
          </Link>
        </div>

        {/* Support note */}
        <p className="mt-8 text-xs text-[var(--text-dim)]">
          Need help? Contact us at{' '}
          <span className="text-[var(--text-muted)]">support@aquesa-solutions.com</span>
        </p>
      </div>
    </div>
  )
}
