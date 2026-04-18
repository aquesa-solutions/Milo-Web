type PayPalEnvironment = 'sandbox' | 'live'

type PayPalOrderAmount = {
  currency_code: 'USD'
  value: string
}

type PayPalOrderCreateResponse = {
  id: string
  status: string
  links?: Array<{ href: string; rel: string; method: string }>
}

type PayPalOrderDetailsResponse = {
  id: string
  status: string
  purchase_units?: Array<{
    custom_id?: string
    payments?: {
      captures?: Array<{
        id: string
        status: string
      }>
    }
  }>
  payer?: {
    payer_id?: string
    email_address?: string
  }
}

type PayPalWebhookVerifyResponse = {
  verification_status?: 'SUCCESS' | 'FAILURE'
}

export const PLANS = {
  builder: {
    name: 'Builder',
    price: 1200,
    amount: '1200.00',
    description: 'Full platform access for product teams and founders',
  },
  devops: {
    name: 'DevOps',
    price: 100,
    amount: '100.00',
    description: 'Profile listing and client discovery tools',
  },
} as const

export type PlanKey = keyof typeof PLANS

function getPayPalBaseUrl() {
  const configuredEnvironment = (process.env.PAYPAL_ENVIRONMENT || 'live').trim().toLowerCase()

  if (configuredEnvironment !== 'live' && configuredEnvironment !== 'sandbox') {
    throw new Error('PAYPAL_ENVIRONMENT must be either "live" or "sandbox".')
  }

  const environment = configuredEnvironment as PayPalEnvironment
  return environment === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

function getPayPalEnvironment() {
  return (process.env.PAYPAL_ENVIRONMENT || 'live').trim().toLowerCase() as PayPalEnvironment
}

function getPayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim()
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim()

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured.')
  }

  return { clientId, clientSecret }
}

export async function getPayPalAccessToken() {
  const { clientId, clientSecret } = getPayPalCredentials()
  const environment = getPayPalEnvironment()

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    if (response.status === 401 && body.includes('invalid_client')) {
      throw new Error(
        `Failed to get PayPal access token: invalid_client. Check that PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET are from the same PayPal REST app and match PAYPAL_ENVIRONMENT=${environment} (live creds with live, sandbox creds with sandbox).`
      )
    }

    throw new Error(`Failed to get PayPal access token: ${response.status} ${body}`)
  }

  const data = (await response.json()) as { access_token: string }
  return data.access_token
}

async function paypalRequest<T>(
  path: string,
  init: RequestInit,
  accessToken?: string
): Promise<T> {
  const token = accessToken || (await getPayPalAccessToken())
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`PayPal API error (${response.status}): ${body}`)
  }

  return (await response.json()) as T
}

export async function createPayPalOrder(params: {
  role: PlanKey
  pendingSignupId: string
  appUrl: string
}) {
  const plan = PLANS[params.role]

  const data = await paypalRequest<PayPalOrderCreateResponse>('/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: params.pendingSignupId,
          description: `${plan.name} monthly plan`,
          amount: {
            currency_code: 'USD',
            value: plan.amount,
          } satisfies PayPalOrderAmount,
        },
      ],
      application_context: {
        brand_name: 'Milo',
        user_action: 'PAY_NOW',
        return_url: `${params.appUrl}/success`,
        cancel_url: `${params.appUrl}/signup?role=${params.role}&canceled=true`,
      },
    }),
  })

  const approveLink = data.links?.find((link) => link.rel === 'approve')

  if (!approveLink?.href) {
    throw new Error('PayPal approve URL was not returned.')
  }

  return {
    id: data.id,
    status: data.status,
    approveUrl: approveLink.href,
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    const capture = await paypalRequest<PayPalOrderDetailsResponse>(
      `/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'PayPal-Request-Id': `capture-${orderId}`,
        },
      }
    )

    return capture
  } catch {
    // If already captured, fetch the order details for idempotent processing.
    return await getPayPalOrder(orderId)
  }
}

export async function getPayPalOrder(orderId: string) {
  return paypalRequest<PayPalOrderDetailsResponse>(`/v2/checkout/orders/${orderId}`, {
    method: 'GET',
  })
}

export function extractPendingSignupId(order: PayPalOrderDetailsResponse) {
  return order.purchase_units?.[0]?.custom_id || null
}

export function extractCaptureId(order: PayPalOrderDetailsResponse) {
  return order.purchase_units?.[0]?.payments?.captures?.[0]?.id || null
}

export function extractPayerId(order: PayPalOrderDetailsResponse) {
  return order.payer?.payer_id || null
}

export async function verifyPayPalWebhookSignature(params: {
  headers: Headers
  event: unknown
}) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID

  if (!webhookId) {
    throw new Error('PAYPAL_WEBHOOK_ID is not configured.')
  }

  const transmissionId = params.headers.get('paypal-transmission-id')
  const transmissionTime = params.headers.get('paypal-transmission-time')
  const certUrl = params.headers.get('paypal-cert-url')
  const authAlgo = params.headers.get('paypal-auth-algo')
  const transmissionSig = params.headers.get('paypal-transmission-sig')

  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig
  ) {
    return false
  }

  const verification = await paypalRequest<PayPalWebhookVerifyResponse>(
    '/v1/notifications/verify-webhook-signature',
    {
      method: 'POST',
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: params.event,
      }),
    }
  )

  return verification.verification_status === 'SUCCESS'
}
