import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabaseServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your Milo dashboard.',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!hasSupabaseConfig) {
    redirect('/login')
  }

  const supabase = await supabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen px-6 pt-28 pb-16 md:px-12">
      <div className="container-narrow mx-auto">
        <div className="card text-center py-16 md:py-20">
          <span className="label">Dashboard</span>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-[var(--text)]">
            Thank you.
          </h1>
          <p className="mt-3 text-base md:text-lg text-[var(--text-muted)]">
            We will reach you back shortly.
          </p>
        </div>
      </div>
    </div>
  )
}
