import type { Metadata } from 'next'
import './globals.css'
import '@fontsource-variable/inter'
import '@fontsource-variable/inter/wght-italic.css'
import Header from '@/components/Header'
import { SkipNavigation } from '@/components/accessibility/SkipLink'
import PageTransition from '@/components/PageTransition'
import DevOverlayFocusGuard from '@/components/DevOverlayFocusGuard'
import { AppProviders } from '@/providers/AppProviders'
import {
  getFooterContent,
  getHomepageContentWithFallback,
  getNavigation,
  getSiteSettings,
} from '../lib/content'
import Footer from '@/components/Footer'
import { WebVitals } from '@/components/WebVitals'
import type { SiteSettings, SiteSocialLinkRecord } from '@/types/site'

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
      default: tagline ? `${siteName} - ${tagline}` : siteName,
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
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

function resolveSocialLinks(socialLinks?: SiteSocialLinkRecord): string[] {
  if (!socialLinks) {
    return []
  }

  return Object.values(socialLinks).filter((url): url is string => Boolean(url))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch site content for context providers
  const [settingsResult, homepageResult, navigationResult, footerResult] = await Promise.all([
    getSiteSettings(DOMAIN),
    getHomepageContentWithFallback(DOMAIN),
    getNavigation(),
    getFooterContent(),
  ])

  const siteSettings: SiteSettings = settingsResult.success
    ? settingsResult.data
    : {
        domain: DOMAIN,
        site_name: 'Website',
        tagline: 'A modern CMS-driven website',
        description: 'Built with Next.js and modern web technologies',
      }

  const homepageContent = homepageResult.success ? homepageResult.data : null
  const navigation = navigationResult.success ? navigationResult.data : null
  const footerContent = footerResult.success ? footerResult.data : null

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings.site_name,
    description: siteSettings.description,
    url: `https://${DOMAIN}`,
    logo:
      siteSettings.logo?.url ||
      siteSettings.logo_url ||
      `https://${DOMAIN}/images/branding/portal-logo.svg`,
    sameAs: resolveSocialLinks(siteSettings.social_links),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
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
      <body className="font-sans">
        <AppProviders
          siteSettings={siteSettings}
          homepageContent={homepageContent}
          navigation={navigation}
          footerContent={footerContent}
        >
          <WebVitals />
          <DevOverlayFocusGuard />
          <SkipNavigation />
          <Header />
          <main id="main-content" role="main" aria-label="Main content">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer
            siteSettings={siteSettings}
            navigation={navigation?.secondary}
            footerContent={footerContent}
          />
        </AppProviders>
      </body>
    </html>
  )
}
