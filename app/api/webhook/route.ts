import { NextRequest, NextResponse } from 'next/server'
import {
  extractPendingSignupId,
  getPayPalOrder,
  verifyPayPalWebhookSignature,
} from '@/lib/paypal'
import { finalizePendingSignup } from '@/lib/payment-provisioning'

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    const isValid = await verifyPayPalWebhookSignature({
      headers: request.headers,
      event,
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid PayPal webhook signature.' }, { status: 400 })
    }

    if (event?.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const paypalOrderId =
      event?.resource?.supplementary_data?.related_ids?.order_id ||
      event?.resource?.id ||
      null

    if (!paypalOrderId || typeof paypalOrderId !== 'string') {
      return NextResponse.json({ error: 'Unable to resolve PayPal order ID.' }, { status: 400 })
    }

    const order = await getPayPalOrder(paypalOrderId)
    const pendingSignupId = extractPendingSignupId(order)

    if (!pendingSignupId) {
      return NextResponse.json({ error: 'No pending signup ID on PayPal order.' }, { status: 400 })
    }

    await finalizePendingSignup({
      pendingSignupId,
      paypalOrderId,
      paypalCaptureId: event?.resource?.id || null,
      paypalPayerId: event?.resource?.payer?.payer_id || null,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[webhook] PayPal webhook processing failed:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
