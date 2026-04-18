import Link from 'next/link'

const footerLinks = [
  {
    heading: 'Platform',
    links: [
      { label: 'For Builders', href: '/signup?role=builder' },
      { label: 'For DevOps', href: '/signup?role=devops' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Get started', href: '/signup' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="container-wide px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              href="/"
              className="text-sm font-semibold tracking-widest uppercase text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            >
              Milo
            </Link>
            <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              The professional network connecting builders and the engineers who run them.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <span className="label mb-4 block">{group.heading}</span>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="divider mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-dim)]">
            © {new Date().getFullYear()} Aquesa Solutions Pvt Ltd. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-dim)]">
            Professional infrastructure, built for scale.
          </p>
        </div>
      </div>
    </footer>
  )
}
