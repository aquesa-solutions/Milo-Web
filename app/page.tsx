import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Milo - Auto-scaling Cloud Infrastructure for Builders',
  description:
    'Milo is a modern cloud provider for builders who ship. Launch with zero-config auto-scaling infrastructure and tap into an elite DevOps network when custom scale is needed.',
  openGraph: {
    title: 'Milo - Auto-scaling Cloud Infrastructure for Builders',
    description:
      'Zero-config auto-scaling cloud infrastructure with an embedded network of elite DevOps engineers.',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative px-6 pt-28 pb-20 md:px-12 md:pt-36 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_50%_0%,rgba(25,68,230,0.12),transparent_65%)]" />

        <div className="container-wide">
          <p className="label animate-fade-up">Cloud Platform for Builders and DevOps</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[var(--text)] md:text-6xl md:leading-[1.05] animate-fade-up-delay-1">
            Auto-scaling cloud infrastructure
            <br />
            for builders who ship
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-[var(--text-muted)] md:text-lg animate-fade-up-delay-2">
            Milo is a modern cloud provider offering zero-config, auto-scaling infrastructure out of the box. And when you finally outgrow the defaults, tap into our built-in network of elite DevOps engineers to scale custom.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/signup?role=builder" className="btn-primary text-[11px]">
              Join as a Builder
            </Link>
            <Link href="/signup?role=devops" className="btn-secondary text-[11px]">
              Join as a DevOps
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="container-wide grid gap-6 md:grid-cols-2">
          <article className="card bg-[var(--surface-2)]">
            <p className="label">For Builders</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
              Launch fast with managed cloud defaults
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] md:text-base">
              Ship without spending weeks on infrastructure. Get auto-scaling compute, managed services, and predictable monthly pricing from day one.
            </p>
            <Link href="/signup?role=builder" className="btn-primary mt-8 text-[11px]">
              Get Started as Builder
            </Link>
          </article>

          <article className="card bg-[var(--surface-2)]">
            <p className="label">For DevOps Engineers</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
              Join teams that need advanced scale
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] md:text-base">
              Work with builders who need migration, optimization, and performance tuning once they outgrow defaults. High-impact projects inside one network.
            </p>
            <Link href="/signup?role=devops" className="btn-secondary mt-8 text-[11px]">
              Join as DevOps
            </Link>
          </article>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="container-wide rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-8 md:p-12">
          <p className="label">How It Works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
            Clear flow from signup to scale
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-dim)]">01</p>
              <h3 className="mt-3 text-lg font-semibold text-[var(--text)]">Choose your role</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">Start as Builder or DevOps directly from signup.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-dim)]">02</p>
              <h3 className="mt-3 text-lg font-semibold text-[var(--text)]">Secure payment</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">Complete PayPal checkout first for a secure onboarding flow.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-dim)]">03</p>
              <h3 className="mt-3 text-lg font-semibold text-[var(--text)]">Account is created</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">We activate your account only after confirmed payment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-20" id="pricing">
        <div className="container-wide">
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[var(--border-light)] pb-6 md:flex-row md:items-end">
            <div>
              <p className="label">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">Simple monthly plans</h2>
            </div>
            <Link href="/pricing" className="text-sm font-semibold text-[var(--accent)] hover:underline">
              View full pricing details
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card bg-[var(--surface-2)]">
              <p className="label">Builder</p>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-[var(--text)]">
                $1200
                <span className="ml-1 text-base font-medium text-[var(--text-muted)]">/month</span>
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                Zero-config infrastructure with built-in path to expert DevOps support as your product scales.
              </p>
              <Link href="/signup?role=builder" className="btn-primary mt-8 text-[11px]">
                Get Started as Builder
              </Link>
            </div>

            <div className="card bg-[var(--surface-2)]">
              <p className="label">DevOps</p>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-[var(--text)]">$100<span className="ml-1 text-base font-medium text-[var(--text-muted)]">/month</span></p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">Access premium builder projects and deliver custom infrastructure upgrades inside Milo.</p>
              <Link href="/signup?role=devops" className="btn-secondary mt-8 text-[11px]">
                Join as DevOps
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
