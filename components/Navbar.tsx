'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Platform' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl" />

      <nav className="relative container-wide flex items-center justify-between h-16 px-6 md:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="text-base font-bold tracking-[0.3em] uppercase text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300 hover:text-black">
          Milo
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-[var(--text)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-[10px]">
            Login
          </Link>
          <Link href="/signup" className="btn-primary text-[10px]">
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-5 bg-[var(--text-muted)] transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-px w-5 bg-[var(--text-muted)] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-[var(--text-muted)] transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden relative border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="divider" />
          <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm">
            Login
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary text-sm">
            Get started
          </Link>
        </div>
      )}
    </header>
  )
}
