import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'How to MeCM - Professional Microsoft Technology Consulting',
  description: 'Expert insights on Microsoft Configuration Manager (MECM/SCCM), Azure cloud technologies, and enterprise solutions.',
  keywords: 'Microsoft Configuration Manager, MECM, SCCM, Azure, Microsoft 365, IT consulting',
  authors: [{ name: 'How to MeCM Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://howtomecm.com',
    siteName: 'How to MeCM',
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "How to MeCM",
    "description": "Professional Microsoft Technology Consulting",
    "url": "https://howtomecm.com",
    "logo": "https://howtomecm.com/logo.png",
    "sameAs": [
      "https://linkedin.com/company/howtomecm"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="canonical" href="https://howtomecm.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}