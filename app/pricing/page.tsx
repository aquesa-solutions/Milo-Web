import type { Metadata } from 'next'
import PricingCard from '@/components/PricingCard'
import fetchPackages from "@/lib/packages";

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for Builders and DevOps Engineers. Builder plan at $1,200/month. DevOps plan at $100/month.',
  openGraph: {
    title: 'Pricing | Milo',
    description: 'Builder plan at $1,200/month. DevOps plan at $100/month. No hidden fees.',
  },
}

const builderFeatures = [
  'Unlimited DevOps Engineer connections',
  'Priority matching within 24 hours',
  'Full access to all platform tools',
  'Dedicated account support',
  'Infrastructure health dashboard',
  'Collaborative project workspaces',
  'Engineer performance reviews',
  'Enterprise billing options',
]

const devopsFeatures = [
  'Profile listing and discovery',
  'Client connection requests',
  'Project management tools',
  'Secure messaging with clients',
  'Earnings and invoice tracking',
  'Stack and certification showcase',
  'Community access and resources',
]

const faqs = [
  {
    q: 'When is my account created?',
    a: 'Your account is created right after your payment is successfully confirmed by PayPal. Activation is done by us after confirmation from our end. You will receive a confirmation email shortly.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Both plans are monthly subscriptions with no long-term commitment. Cancel at any time from your dashboard.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept PayPal balance, connected cards, and eligible local payment methods through PayPal Checkout.',
  },
  {
    q: 'Is there a free trial?',
    a: 'There is no free trial at this time. All accounts require a paid subscription to maintain the quality bar of the network.',
  },
]

async function buildPriceTags() {
  const result = await fetchPackages()
  if(result.error)
    return <h1>Unable to fetch the price tags at this moment</h1>
  return result.packages.map((package_) => (
    <PricingCard
      key={package_.id}
      role={package_.item_id}
      price={package_.price}
      name={package_.name}
      description={package_.description}
      features={[]}
    />
  ))
}

export default async function PricingPage() {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12">
      {/* Header */}
      <div className="container-narrow mx-auto text-center mb-20">
        <span className="label">Pricing</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--text)]">
          Simple, transparent pricing.
        </h1>
        <p className="mt-5 text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          Two plans designed for the two sides of the platform. No tiers, no feature gates —
          everything included from day one.
        </p>
      </div>

      {/* Cards */}
      <div className="container-narrow mx-auto">
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {await buildPriceTags()}
        </div>

        {/* Guarantee */}
        <div className="mt-12 card max-w-3xl mx-auto flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--border-light)] flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Secure payment via PayPal</p>
            <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
              All payments are processed securely through PayPal. Your financial details are never
              stored on our servers. Your account is activated immediately after payment confirmation.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] mb-10">
            FAQs
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-t border-[var(--border)] pt-6">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
