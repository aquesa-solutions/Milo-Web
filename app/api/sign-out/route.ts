import { NextRequest, NextResponse } from 'next/server'
import { supabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await supabaseServerClient()
  await supabase.auth.signOut()

  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}
