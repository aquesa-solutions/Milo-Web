import { NextRequest, NextResponse } from 'next/server'
import { supabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const nextPath = url.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await supabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      const redirectUrl = new URL('/login', url.origin)
      redirectUrl.searchParams.set('error', 'auth-callback')
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(new URL(nextPath, url.origin))
}
