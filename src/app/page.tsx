import { Metadata } from 'next'
import Link from 'next/link'

import { getHomepageContentWithFallback } from '../lib/content'
import { getDemoPosts } from '../lib/demoContent'
import BlogCard from '@/components/blog/BlogCard'
import type { HomepageCta, HomepageContent, HomepageVideoHighlight } from '@/types/site-content'

const defaultVideoHighlights: HomepageVideoHighlight[] = [
  {
    title: 'Deploy Microsoft 365 Apps with Intune',
    description:
      'Step-by-step Microsoft 365 Apps deployment using the Intune admin center, including channel and licensing guidance.',
    url: 'https://www.youtube.com/watch?v=Y0KfzfGQ3_0',
    duration: '21 min',
    topic: 'Intune apps',
  },
  {
    title: 'Intune & MECM co-management lab',
    description:
      'Configure workload splits, enrollment, and reporting for co-managed Windows devices.',
    url: 'https://www.youtube.com/watch?v=PXk1te_FYJ8',
    duration: '18 min',
    topic: 'Co-management',
  },
  {
    title: 'Automating application updates with MECM',
    description:
      'PowerShell strategies for packaging, pre-flight checks, and phased deployments in ConfigMgr.',
    url: 'https://www.youtube.com/watch?v=t4NCSbI7ZJM',
    duration: '22 min',
    topic: 'Automation',
  },
  {
    title: 'Windows Autopilot reality check',
    description:
      'Hybrid join setup, ESP tuning, and troubleshooting device provisioning end-to-end.',
    url: 'https://www.youtube.com/watch?v=btV4Z1eC4AY',
    duration: '16 min',
    topic: 'Autopilot',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()
  const homepageResult = await getHomepageContentWithFallback(DOMAIN)
  const homepageContent: HomepageContent | null = homepageResult.success
    ? homepageResult.data
    : null

  const defaultTitle = 'How to MeCM – Endpoint management knowledge hub'
  const defaultDescription =
    'Deep technical guides, walkthroughs, and community resources for Microsoft endpoint teams.'

  return {
    title: homepageContent?.seo?.title || defaultTitle,
    description: homepageContent?.seo?.description || defaultDescription,
  }
}

export default async function HomePage() {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()
  const homepageResult = await getHomepageContentWithFallback(DOMAIN)
  const homepageContent = homepageResult.success ? homepageResult.data : null

  const heroHeading =
    homepageContent?.hero?.heading?.trim() || 'Endpoint management knowledge center'
  const heroSubtitle =
    homepageContent?.hero?.subtitle?.trim() ||
    'Hands-on guides, lab notes, and deployment experiments for Microsoft endpoint administrators.'
  const heroBadge = homepageContent?.hero?.badge?.trim() || 'How to MeCM Knowledge Base'
  const heroPrimaryCta = homepageContent?.hero?.primaryCta
  const heroSecondaryCta = homepageContent?.hero?.secondaryCta

  const recentPosts = getDemoPosts().slice(0, 5)
  const latestPostsContent = homepageContent?.latestPosts

  const videoHighlights: HomepageVideoHighlight[] = homepageContent?.videoHighlights?.length
    ? homepageContent.videoHighlights
    : defaultVideoHighlights

  const ctaPanel = homepageContent?.ctaPanel

  const renderCta = (cta: HomepageCta | undefined, variant: 'primary' | 'secondary') => {
    if (!cta?.href || !cta.label) {
      return null
    }

    const isExternal = Boolean(cta.external)
    const baseProps = {
      href: cta.href,
      target: isExternal ? '_blank' : undefined,
      rel: isExternal ? 'noopener noreferrer' : undefined,
    }

    if (variant === 'secondary' || cta.style === 'outline') {
      return (
        <Link
          key={cta.label}
          {...baseProps}
          className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/10"
        >
          {cta.label}
        </Link>
      )
    }

    return (
      <Link
        key={cta.label}
        {...baseProps}
        className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:-translate-y-1"
      >
        {cta.label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main id="main-content" className="space-y-24">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-24 text-white">
          <div className="absolute inset-0 opacity-40" aria-hidden="true">
            <div className="absolute left-12 top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-purple-300/30 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/20 blur-3xl" />
          </div>

          <div className="container-modern relative">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                {heroBadge}
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {heroHeading}
              </h1>
              <p className="mt-6 text-lg text-blue-100 md:text-xl">{heroSubtitle}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {renderCta(heroPrimaryCta, 'primary')}
                {renderCta(heroSecondaryCta, 'secondary')}
              </div>
            </div>
          </div>
        </section>

        {recentPosts.length > 0 && (
          <section className="bg-white py-10 dark:bg-gray-900">
            <div className="container-modern">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {latestPostsContent?.heading || 'Latest field notes'}
                </h2>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                  {latestPostsContent?.subtitle ||
                    'Configuration walkthroughs and automation experiments pulled straight from enterprise deployments.'}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {recentPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                {latestPostsContent?.cta?.href ? (
                  <Link
                    href={latestPostsContent.cta.href}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-1 dark:bg-white dark:text-gray-900"
                  >
                    {latestPostsContent.cta.label || 'Explore all articles'}
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-1 dark:bg-white dark:text-gray-900"
                  >
                    Explore all articles
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="container-modern" id="video-library" data-testid="video-library">
          <header className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Video deep dives</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Watch practical walkthroughs for deployment patterns, automation, and troubleshooting
              recorded directly from lab and production environments.
            </p>
          </header>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {videoHighlights.map(video => (
              <article
                key={video.title}
                data-testid="video-card"
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-lg transition-transform duration-200 hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900/70"
              >
                <div className="relative z-10 flex h-full flex-col gap-4">
                  <div>
                    {video.topic && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                        {video.topic}
                      </span>
                    )}
                    <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                      {video.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      {video.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{video.duration || 'On-demand session'}</span>
                    <Link
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700"
                    >
                      Watch now
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M12 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 py-20 text-white">
          <div className="container-modern text-center">
            <h2 className="text-3xl font-bold">
              {ctaPanel?.heading || 'What should we explore next?'}
            </h2>
            <p className="mt-3 text-lg text-blue-100">
              {ctaPanel?.body ||
                'Share the scenarios, blockers, or deployment questions you want broken down in an upcoming article or video.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {renderCta(ctaPanel?.primaryCta, 'primary') || (
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  Suggest a topic
                </Link>
              )}
              {renderCta(ctaPanel?.secondaryCta, 'secondary') || (
                <Link
                  href="https://youtube.com/@howtomecm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/10"
                >
                  Follow the video updates
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
