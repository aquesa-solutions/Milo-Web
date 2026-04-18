import { NextRequest, NextResponse } from 'next/server'
import { PLANS, createPayPalOrder } from '@/lib/paypal'
import {
  attachPayPalOrderToPendingSignup,
  createPendingSignup,
} from '@/lib/payment-provisioning'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, organization, role } = body

    // ── Validate input ─────────────────────────────
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, role.' },
        { status: 400 }
      )
    }

    if (!['builder', 'devops'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "builder" or "devops".' },
        { status: 400 }
      )
    }

    if (role === 'builder' && !organization) {
      return NextResponse.json(
        { error: 'Organisation is required for Builder accounts.' },
        { status: 400 }
      )
    }

    const plan = PLANS[role as keyof typeof PLANS]

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (!plan.amount) {
      return NextResponse.json(
        { error: `PayPal plan amount for "${role}" is not configured.` },
        { status: 500 }
      )
    }

    const pendingSignupId = await createPendingSignup({
      name,
      email,
      password,
      role,
      organization,
    })

    const order = await createPayPalOrder({
      role,
      pendingSignupId,
      appUrl,
    })

    await attachPayPalOrderToPendingSignup(pendingSignupId, order.id)

    return NextResponse.json({ url: order.approveUrl }, { status: 200 })
  } catch (error: unknown) {
    console.error('[create-checkout-session]', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 402 })
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
