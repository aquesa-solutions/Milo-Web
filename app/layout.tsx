import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Milo — Auto-scaling Cloud Infrastructure & DevOps Network',
    template: '%s | Milo',
  },
  description:
    'Milo is the first cloud provider for builders that comes with built-in auto-scaling infrastructure, paired with a secondary network of world-class DevOps engineers.',
  keywords: ['cloud provider', 'auto-scaling', 'infrastructure', 'builders', 'devops', 'platform engineering'],
  openGraph: {
    title: 'Milo — Auto-scaling Cloud Infrastructure',
    description:
      'Deploy on auto-scaling cloud infrastructure made for builders. Connect with DevOps engineers when you need custom scale.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milo — Auto-scaling Cloud Infrastructure',
    description: 'Deploy on auto-scaling cloud infrastructure made for builders.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="paper-bg">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
