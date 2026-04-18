'use server'

import { redirect } from 'next/navigation'
import { supabaseServerClient } from '@/lib/supabase-server'

export type AuthActionState = {
  error: string | null
  message: string | null
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '').trim()

  if (!email || !password) {
    return { error: 'Please enter your email and password.', message: null }
  }

  const supabase = await supabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message, message: null }
  }

  redirect('/dashboard')
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get('email') || '').trim().toLowerCase()

  if (!email) {
    return { error: 'Please enter your email address.', message: null }
  }

  const supabase = await supabaseServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message, message: null }
  }

  return {
    error: null,
    message: 'Password reset link sent. Check your inbox and spam folder.',
  }
}

export async function updatePasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get('password') || '').trim()
  const confirmPassword = String(formData.get('confirmPassword') || '').trim()

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.', message: null }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.', message: null }
  }

  const supabase = await supabaseServerClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message, message: null }
  }

  return {
    error: null,
    message: 'Password updated. You can now sign in with your new password.',
  }
}
