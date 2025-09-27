import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { SkipNavigation } from '@/components/accessibility/SkipLink'
import PageTransition from '@/components/PageTransition'
import DevOverlayFocusGuard from '@/components/DevOverlayFocusGuard'
import { AppProviders } from '@/providers/AppProviders'
import { getSiteSettings } from '../lib/content'
import Footer from '@/components/Footer'
import { WebVitals } from '@/components/WebVitals'
import type { SiteSettings, SiteSocialLinkItem, SiteSocialLinkRecord } from '@/types/site'

const inter = Inter({ subsets: ['latin'] })

// Dynamic metadata generation based on CMS settings
export async function generateMetadata(): Promise<Metadata> {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.example.com').trim()

  const settingsResult = await getSiteSettings(DOMAIN)
  const siteSettings: SiteSettings | null = settingsResult.success ? settingsResult.data : null

  const siteName = siteSettings?.site_name || 'Website'
  const description = siteSettings?.description || 'A modern website built with Next.js and CMS'
  const tagline = siteSettings?.tagline || ''

  return {
    metadataBase: new URL(`https://${DOMAIN}`),
    title: {
      template: `%s | ${siteName}`,
      default: tagline ? `${siteName} - ${tagline}` : siteName
    },
    description,
    keywords: siteSettings?.keywords,
    authors: siteSettings?.author ? [{ name: siteSettings.author }] : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://${DOMAIN}`,
      siteName,
      title: siteName,
      description
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

function resolveSocialLinks(
  socialLinks?: SiteSocialLinkRecord | SiteSocialLinkItem[]
): string[] {
  if (!socialLinks) {
    return []
  }

  if (Array.isArray(socialLinks)) {
    return socialLinks
      .filter(link => Boolean(link?.url) && link.enabled !== false)
      .map(link => link.url)
  }

  return Object.values(socialLinks).filter((url): url is string => Boolean(url))
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch site settings for context
  const settingsResult = await getSiteSettings(DOMAIN)
  const siteSettings: SiteSettings = settingsResult.success
    ? settingsResult.data
    : {
        domain: DOMAIN,
        site_name: 'Website',
        tagline: 'A modern CMS-driven website',
        description: 'Built with Next.js and modern web technologies'
      }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteSettings.site_name,
    "description": siteSettings.description,
    "url": `https://${DOMAIN}`,
    "logo": siteSettings.logo?.url || siteSettings.logo_url || `https://${DOMAIN}/images/branding/portal-logo.svg`,
    "sameAs": resolveSocialLinks(siteSettings.social_links),
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  }

  return (
    <html lang="en" className="light" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="canonical" href={`https://${DOMAIN}`} />
      </head>
      <body className={inter.className}>
        <AppProviders siteSettings={siteSettings}>
          <WebVitals />
          <DevOverlayFocusGuard />
          <SkipNavigation />
          <Header />
          <main id="main-content" role="main" aria-label="Main content">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer siteSettings={siteSettings} />
        </AppProviders>
      </body>
    </html>
  )
}
