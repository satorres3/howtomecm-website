import Link from 'next/link'

import type { SiteSettings, SiteSocialLinkRecord } from '@/types/site'
import type { FooterContent, SiteNavigationItem } from '@/types/site-content'

interface FooterProps {
  siteSettings: SiteSettings
  navigation?: SiteNavigationItem[]
  footerContent?: FooterContent | null
}

const fallbackNavLinks: SiteNavigationItem[] = [
  { id: 'home', label: 'Home', href: '/', order: 1 },
  { id: 'blog', label: 'Blog', href: '/blog', order: 2 },
  { id: 'about', label: 'About', href: '/about', order: 3 },
  { id: 'contact', label: 'Contact', href: '/contact', order: 4 }
]

function formatPlatformLabel(platform: string): string {
  switch (platform) {
    case 'youtube':
      return 'YouTube'
    case 'linkedin':
      return 'LinkedIn'
    case 'twitter':
      return 'Twitter'
    case 'github':
      return 'GitHub'
    default:
      return platform.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  }
}

export default function Footer({ siteSettings, navigation, footerContent }: FooterProps) {
  const year = new Date().getFullYear()
  const siteName = siteSettings?.site_name || 'How to MeCM'
  const tagline = siteSettings?.tagline || 'Microsoft endpoint knowledge hub'
  const socialLinks: SiteSocialLinkRecord = siteSettings?.social_links ?? {}
  const socialEntries = Object.entries(socialLinks).reduce<Array<[string, string]>>((acc, [platform, url]) => {
    if (typeof url === 'string' && url.length > 0) {
      acc.push([platform, url])
    }
    return acc
  }, [])
  const navLinks = navigation?.length ? navigation : fallbackNavLinks
  const introContent = footerContent?.intro

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white">
      <div className="container-modern py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">{siteName}</p>
              <h2 className="mt-4 text-3xl font-bold">
                {introContent?.heading || 'Build reliable Microsoft endpoint experiences.'}
              </h2>
              <p className="mt-3 max-w-xl text-sm text-blue-100">
                {introContent?.body ||
                  `${tagline}. Weekly guides and lab notes that help MECM, Intune, and automation teams ship with confidence.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={introContent?.primaryCta?.href || '/blog'}
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
              >
                {introContent?.primaryCta?.label || 'Explore the blog'}
              </Link>
              <Link
                href={introContent?.secondaryCta?.href || '/contact'}
                className="inline-flex items-center rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                {introContent?.secondaryCta?.label || 'Suggest a topic'}
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-100">Navigation</h3>
              <ul className="mt-4 space-y-2 text-sm text-blue-100">
                {navLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-150 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-100">Connect</h3>
              <ul className="mt-4 space-y-2 text-sm text-blue-100">
                {socialEntries.length === 0 && (
                  <li className="text-blue-200/70">Add social links in site settings to display them here.</li>
                )}
                {socialEntries.map(([platform, url]) => (
                  <li key={platform}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {formatPlatformLabel(platform)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-6 text-xs text-blue-200">
          © {year} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
