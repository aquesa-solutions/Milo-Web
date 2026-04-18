import { createClient } from '@supabase/supabase-js'

type PendingSignup = {
  id: string
  name: string
  email: string
  password: string
  role: 'builder' | 'devops'
  organization: string | null
  processed_at: string | null
}

function parseJwtRole(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) {
      return null
    }

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8')) as {
      role?: string
    }

    return decoded.role || null
  } catch {
    return null
  }
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase admin credentials are not set.')
  }

  const role = parseJwtRole(key)
  if (role !== 'service_role') {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not a service_role key. Open Supabase Dashboard > Project Settings > API and copy the service_role secret key (not anon), then restart your server.'
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function createPendingSignup(input: {
  name: string
  email: string
  password: string
  role: 'builder' | 'devops'
  organization?: string
  paypalOrderId?: string
}) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('pending_signups')
    .insert({
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      organization: input.organization || null,
      paypal_order_id: input.paypalOrderId || null,
    })
    .select('id')
    .single()

  if (error?.message?.includes("Could not find the table 'public.pending_signups'")) {
    throw new Error(
      'Failed to create pending signup: missing table public.pending_signups. Run the latest SQL from supabase/schema.sql in your Supabase SQL Editor, then retry.'
    )
  }

  if (error || !data?.id) {
    throw new Error(`Failed to create pending signup: ${error?.message || 'Unknown error'}`)
  }

  return data.id as string
}

export async function attachPayPalOrderToPendingSignup(pendingSignupId: string, orderId: string) {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('pending_signups')
    .update({ paypal_order_id: orderId })
    .eq('id', pendingSignupId)

  if (error) {
    throw new Error(`Failed to attach PayPal order to pending signup: ${error.message}`)
  }
}

export async function finalizePendingSignup(params: {
  pendingSignupId: string
  paypalOrderId: string
  paypalCaptureId?: string | null
  paypalPayerId?: string | null
}) {
  const supabase = getSupabaseAdmin()

  const { data: pending, error: pendingError } = await supabase
    .from('pending_signups')
    .select('id,name,email,password,role,organization,processed_at')
    .eq('id', params.pendingSignupId)
    .single<PendingSignup>()

  if (pendingError || !pending) {
    throw new Error(`Pending signup not found: ${pendingError?.message || 'Unknown error'}`)
  }

  if (pending.processed_at) {
    return { alreadyProcessed: true }
  }

  let userId: string | null = null

  const { data: existingProfile } = await supabase
    .from('users')
    .select('id')
    .eq('email', pending.email)
    .maybeSingle<{ id: string }>()

  if (existingProfile?.id) {
    userId = existingProfile.id
  } else {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: pending.email,
      password: pending.password,
      email_confirm: true,
    })

    if (authError) {
      if (!authError.message.includes('already registered')) {
        throw new Error(`Failed to create auth user: ${authError.message}`)
      }

      const { data: fallbackProfile } = await supabase
        .from('users')
        .select('id')
        .eq('email', pending.email)
        .maybeSingle<{ id: string }>()

      if (fallbackProfile?.id) {
        userId = fallbackProfile.id
      }
    } else {
      userId = authData.user?.id || null
    }
  }

  if (!userId) {
    throw new Error('Unable to resolve user ID for pending signup.')
  }

  const { error: profileError } = await supabase.from('users').upsert(
    {
      id: userId,
      email: pending.email,
      name: pending.name,
      role: pending.role,
      organization: pending.organization,
    },
    { onConflict: 'id' }
  )

  if (profileError) {
    throw new Error(`Failed to upsert profile: ${profileError.message}`)
  }

  const { error: subscriptionError } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: params.paypalPayerId || `paypal:${pending.id}`,
      stripe_subscription_id: `paypal_order:${params.paypalOrderId}`,
      plan: pending.role,
      status: 'active',
    },
    { onConflict: 'stripe_subscription_id' }
  )

  if (subscriptionError) {
    throw new Error(`Failed to create subscription record: ${subscriptionError.message}`)
  }

  const { error: pendingUpdateError } = await supabase
    .from('pending_signups')
    .update({
      processed_at: new Date().toISOString(),
      paypal_order_id: params.paypalOrderId,
      paypal_capture_id: params.paypalCaptureId || null,
      password: null,
    })
    .eq('id', pending.id)

  if (pendingUpdateError) {
    throw new Error(`Failed to mark pending signup as processed: ${pendingUpdateError.message}`)
  }

  return {
    alreadyProcessed: false,
    email: pending.email,
    role: pending.role,
  }
}
