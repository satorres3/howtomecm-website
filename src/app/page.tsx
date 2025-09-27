import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ContentLibrary, getHomepageContentWithFallback } from '../lib/content'
import type { Post } from '../../types/content'
import BlogCard from '@/components/blog/BlogCard'
import { getDemoPosts, getDemoCategories } from '../lib/demoContent'

// Dynamic metadata generation from CMS content
export async function generateMetadata(): Promise<Metadata> {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

  try {
    const homepageResult = await getHomepageContentWithFallback(DOMAIN)

    if (homepageResult.success && homepageResult.data) {
      const { seo } = homepageResult.data

      if (seo) {
        return {
          title: seo.pageTitle ?? undefined,
          description: seo.metaDescription ?? undefined,
          keywords: Array.isArray(seo.keywords) ? seo.keywords.join(', ') : undefined,
          openGraph: seo.openGraph ? {
            title: seo.openGraph.title ?? undefined,
            description: seo.openGraph.description ?? undefined,
            url: seo.openGraph.url ?? undefined,
            siteName: seo.openGraph.siteName ?? undefined,
            images: seo.openGraph.image ? [seo.openGraph.image] : undefined,
            type: 'website'
          } : undefined,
          twitter: seo.twitter ? {
            card: seo.twitter.card as any,
            title: seo.twitter.title ?? undefined,
            description: seo.twitter.description ?? undefined,
            images: seo.twitter.image ? [seo.twitter.image] : undefined,
          } : undefined
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  // Fallback metadata
  return {
    title: 'How to MeCM – Endpoint management knowledge hub',
    description: 'Deep technical guides, walkthroughs, and community resources for Microsoft endpoint teams.',
  }
}

export default async function HomePage() {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

  try {
    // Fetch homepage content with fallback
    const homepageResult = await getHomepageContentWithFallback(DOMAIN)

    if (!homepageResult.success || !homepageResult.data) {
      throw new Error(homepageResult.error || 'Failed to load homepage content')
    }

    const homepageContent = homepageResult.data
    const youtubeBrandLogo = {
      url: 'https://assets.zyrosite.com/A0xw0LoMOVtarQa0/how-to-mk3zRRxqrQFyKNnl.gif',
      alt: 'How to MeCM portal logo'
    }

    const heroHeading = homepageContent.welcome?.mainHeading?.trim() || 'Endpoint management knowledge center'
    const heroSubtitle = homepageContent.welcome?.subtitle?.trim() ||
      'Hands-on guides, lab notes, and deployment experiments for Microsoft endpoint administrators.'

    const categoriesResult = await ContentLibrary.getCategories(DOMAIN)
    const cmsCategories = categoriesResult.success ? (categoriesResult.data || []) : []
    const demoCategories = getDemoCategories()
    const demoCategoryMap = new Map(demoCategories.map((category: any) => [category.slug, category]))

    const learningSource = (cmsCategories.length ? cmsCategories : demoCategories).slice(0, 3)
    const learningTracks = learningSource.map((category: any) => {
      const enhancement = demoCategoryMap.get(category.slug)
      return {
        title: category.name,
        description: category.description || enhancement?.description || 'Deep dives for endpoint teams.',
        icon: enhancement?.icon || '📘'
      }
    })

    type VideoHighlight = {
      title: string
      description: string
      url: string
      duration?: string
      topic?: string
    }

    const featuredVideo = homepageContent.featuredVideo
    const curatedVideos: VideoHighlight[] = []

    if (featuredVideo?.isActive) {
      const embedUrl = featuredVideo.video?.embedUrl
        || (featuredVideo.video?.platform === 'youtube' && featuredVideo.video?.videoId
          ? `https://www.youtube.com/watch?v=${featuredVideo.video.videoId}`
          : undefined)

      curatedVideos.push({
        title: featuredVideo.video?.title || featuredVideo.title || 'Featured tutorial',
        description: featuredVideo.video?.description || featuredVideo.description || 'Watch the latest walkthrough from the How to MeCM team.',
        url: embedUrl || 'https://www.youtube.com/@howtomecm',
        duration: 'Featured session',
        topic: 'Latest upload'
      })
    }

    const fallbackVideos: VideoHighlight[] = [
      {
        title: 'Deploy Microsoft 365 Apps with Intune',
        description: 'Step-by-step Microsoft 365 Apps deployment using the Intune admin center, including channel and licensing guidance.',
        url: 'https://www.youtube.com/watch?v=Y0KfzfGQ3_0',
        duration: '21 min',
        topic: 'Intune apps'
      },
      {
        title: 'Intune & MECM co-management lab',
        description: 'Configure workload splits, enrollment, and reporting for co-managed Windows devices.',
        url: 'https://www.youtube.com/watch?v=PXk1te_FYJ8',
        duration: '18 min',
        topic: 'Co-management'
      },
      {
        title: 'Automating application updates with MECM',
        description: 'PowerShell strategies for packaging, pre-flight checks, and phased deployments in ConfigMgr.',
        url: 'https://www.youtube.com/watch?v=t4NCSbI7ZJM',
        duration: '22 min',
        topic: 'Automation'
      },
      {
        title: 'Windows Autopilot reality check',
        description: 'Hybrid join setup, ESP tuning, and troubleshooting device provisioning end-to-end.',
        url: 'https://www.youtube.com/watch?v=btV4Z1eC4AY',
        duration: '16 min',
        topic: 'Autopilot'
      }
    ]

    const videoHighlights = Array.from(
      new Map<string, VideoHighlight>([...curatedVideos, ...fallbackVideos].map(video => [video.title, video]))
    ).map(([, video]) => video).slice(0, 4)

    const postsResult = await ContentLibrary.getRecentPosts(DOMAIN, 5)
    const fetchedPosts: Post[] = postsResult.success ? (postsResult.data || []) : []
    const recentPosts = getDemoPosts().slice(0, 5)

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main id="main-content" className="space-y-24">
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-24 text-white">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-10 left-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-purple-300/30 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/20 blur-3xl" />
            </div>

            <div className="relative container-modern">
              <div className="mx-auto max-w-4xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                  How to MeCM Knowledge Base
                </span>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  {heroHeading}
                </h1>
                <p className="mt-6 text-lg text-blue-100 md:text-xl">
                  {heroSubtitle}
                </p>

              </div>
            </div>
          </section>

          {recentPosts.length > 0 && (
            <section className="bg-white py-10 dark:bg-gray-900">
              <div className="container-modern">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest field notes</h2>
                  <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                    Current release wave breakdowns, configuration walkthroughs, and automation experiments straight from customer engagements.
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {recentPosts.slice(0, 6).map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-1 dark:bg-white dark:text-gray-900"
                  >
                    Explore all articles
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
          )}

          <section className="container-modern" id="video-library" data-testid="video-library">
            <header className="max-w-3xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Video deep dives</h2>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                Watch practical walk-throughs for deployment patterns, automation, and troubleshooting series recorded directly from lab and production environments.
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
                      <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{video.title}</h3>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{video.description}</p>
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
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {homepageContent.promotionalCards.length > 0 && (
            <section className="container-modern">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Deep-dive resources &amp; community</h2>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                  Meet the engineers, watch live deployments, and access reusable automation frameworks.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {homepageContent.promotionalCards.map((card: any) => {
                  const isYoutubeCard = card.type === 'youtube' || /youtube\.com/i.test(card.url || '')

                  return (
                    <Link
                      key={card.id}
                      href={card.url}
                      target={card.target}
                      rel={card.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl transition-transform duration-200 hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(135deg, ${card.gradientColors.from}, ${card.gradientColors.via}, ${card.gradientColors.to})`
                    }}
                  >
                    {isYoutubeCard && (
                      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 md:right-4 lg:right-6">
                        <div className="h-[220px] w-[220px] overflow-hidden rounded-full border border-white/40 bg-white/10 p-4 shadow-2xl backdrop-blur-lg md:h-[260px] md:w-[260px]">
                          <Image
                            src={youtubeBrandLogo.url}
                            alt={youtubeBrandLogo.alt}
                            width={220}
                            height={220}
                            className="h-full w-full object-contain"
                            priority
                          />
                        </div>
                      </div>
                    )}
                    <div className="relative z-10 space-y-3">
                      <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {card.type === 'youtube' ? 'Video series' : card.type === 'linkedin' ? 'Community' : 'Resource'}
                      </span>
                      {isYoutubeCard ? (
                          <h3 className="text-2xl font-semibold">{card.title}</h3>
                        ) : (
                          <h3 className="text-2xl font-semibold">{card.title}</h3>
                        )}
                        <p className="text-sm text-white/80">{card.subtitle}</p>
                        <p className="text-sm text-white/70">{card.description}</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/30" aria-hidden="true" />
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          <section className="bg-gray-900 py-20 text-white">
            <div className="container-modern text-center">
              <h2 className="text-3xl font-bold">What should we explore next?</h2>
              <p className="mt-3 text-lg text-blue-100">
                Share the scenarios, blockers, or deployment questions you want broken down in an upcoming article or video.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  Suggest a topic
                </Link>
                <Link
                  href="https://youtube.com/@howtomecm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/10"
                >
                  Follow the video updates
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Homepage error:', error)

    // Fallback content when CMS fails
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <main id="main-content" className="container mx-auto px-4 py-16">
          <section className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                The Official Portal Blog
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Your gateway to expert insights, comprehensive tutorials, and professional consulting on Microsoft technologies.
              </p>
            </div>
          </section>

          <section className="py-16 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 hover:shadow-lg"
            >
              Explore Articles
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        </main>
      </div>
    )
  }
}
