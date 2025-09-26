import Link from 'next/link'

interface FooterProps {
  siteSettings: Record<string, any>
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
]

export default function Footer({ siteSettings }: FooterProps) {
  const year = new Date().getFullYear()
  const siteName = siteSettings?.site_name || 'How to MeCM'
  const tagline = siteSettings?.tagline || 'Microsoft endpoint knowledge hub'
  const social = siteSettings?.social_links || {}

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white">
      <div className="container-modern py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">{siteName}</p>
              <h2 className="mt-4 text-3xl font-bold">Build reliable Microsoft endpoint experiences.</h2>
              <p className="mt-3 max-w-xl text-sm text-blue-100">
                {tagline}. Weekly guides and lab notes that help MECM, Intune, and automation teams ship with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Explore the blog
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Suggest a topic
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
                {social.youtube && (
                  <li>
                    <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      YouTube
                    </a>
                  </li>
                )}
                {social.linkedin && (
                  <li>
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      LinkedIn
                    </a>
                  </li>
                )}
                {social.twitter && (
                  <li>
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      Twitter
                    </a>
                  </li>
                )}
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
