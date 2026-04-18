import Link from 'next/link'

interface PricingCardProps {
  role: string
  price: number
  name: string
  description: string
  features: string[]
  highlighted?: boolean
}

export default function PricingCard({
  role,
  price,
  name,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
        highlighted
          ? 'bg-[var(--surface)] border border-[var(--accent-border)] shadow-[0_0_60px_var(--accent-dim)]'
          : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-light)]'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
      )}

      {/* Header */}
      <div className="mb-8">
        <span className="label mb-3 block">{name}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight text-[var(--text)]">
            ${price.toLocaleString()}
          </span>
          <span className="text-sm text-[var(--text-muted)]">/month</span>
        </div>
        <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border border-[var(--border-light)] flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-[var(--accent)]"
                fill="none"
                viewBox="0 0 10 8"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polyline points="1 4 3.5 6.5 9 1" />
              </svg>
            </span>
            <span className="text-sm text-[var(--text-muted)]">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={`/signup?role=${role}`}
        className={highlighted ? 'btn-primary w-full text-center' : 'btn-secondary w-full text-center'}
      >
        Get started
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
          <path d="M1 7h12M7 1l6 6-6 6" />
        </svg>
      </Link>
    </div>
  )
}
