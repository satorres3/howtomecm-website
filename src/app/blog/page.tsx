import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ContentLibrary } from '../../lib/content'
import type { Post } from '../../../types/content'
import BlogCard from '@/components/blog/BlogCard'
import { getDemoPosts, getDemoCategories } from '../../lib/demoContent'
import BlogClientFilter from '@/components/blog/BlogClientFilter'

export const metadata: Metadata = {
  title: 'Blog - How to MeCM',
  description: 'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
}

export default async function BlogPage() {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

  try {
    const postsResult = await ContentLibrary.getAllPosts(DOMAIN)
    const fetchedPosts: Post[] = postsResult.success ? (postsResult.data || []) : []
    const demoPosts = getDemoPosts()

    // Log any database errors for debugging (only in development)
    if (!postsResult.success && process.env.NODE_ENV === 'development') {
      console.debug('CMS posts not available, using demo content:', postsResult.error)
    }

    // Use demo posts by default to ensure consistency with homepage
    const posts: Post[] = demoPosts

    const categoriesResult = await ContentLibrary.getCategories(DOMAIN)
    const cmsCategories = categoriesResult.success ? (categoriesResult.data || []) : []
    const demoCategories = getDemoCategories()
    const categoryMap = new Map(demoCategories.map((category: any) => [category.slug, category]))

    const categoryList = (cmsCategories.length ? cmsCategories : demoCategories).map((category: any) => {
      const enhancement = categoryMap.get(category.slug)
      return {
        ...category,
        icon: enhancement?.icon || '📘',
        description: category.description || enhancement?.description || ''
      }
    })

    const siteSettingsResult = await ContentLibrary.getSiteSettings(DOMAIN)
    const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null

    const heroTitle = 'Latest insights from the How to MeCM team'
    const heroSubtitle = 'Deep dives, configuration walkthroughs, and battle-tested guidance for Microsoft Endpoint Configuration Manager, Intune, Azure, and the modern workplace.'

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main id="main-content" className="space-y-24">
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-24 text-white">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-12 left-16 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute bottom-12 right-12 h-44 w-44 rounded-full bg-purple-300/25 blur-3xl" />
            </div>

            <div className="relative container-modern">
              <div className="mx-auto max-w-4xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                  How to MeCM Blog
                </span>
                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  {heroTitle}
                </h1>
                <p className="mt-6 text-lg text-blue-100 md:text-xl">
                  {heroSubtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-blue-50"
                  >
                    Back to homepage
                  </Link>
                  <a
                    href="#latest"
                    className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/10"
                  >
                    Jump to latest insights
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Client-side filtering component */}
          <Suspense fallback={
            <div className="container-modern">
              <div className="animate-pulse space-y-8">
                <div className="flex flex-wrap gap-3">
                  <div className="h-8 w-24 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="h-8 w-28 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-12">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-200 h-96 rounded-lg dark:bg-gray-700"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <BlogClientFilter posts={posts} categories={categoryList} />
          </Suspense>

          <section className="container-modern">
            <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white px-8 py-12 shadow-xl transition-transform duration-200 hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/10 to-transparent" aria-hidden="true" />
              <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-300">
                    Stay in the loop
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                    Subscribe for fresh endpoint strategies
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                    Join the {siteSettings?.site_name || 'How to MeCM'} community for Intune, MECM, and automation updates. No spam—just battle-tested insights.
                  </p>
                </div>

                <form className="grid w-full gap-4 sm:grid-cols-[minmax(0,1fr)_auto]" data-testid="blog-subscribe-form">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Work email
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    className="input-modern"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 dark:bg-white dark:text-gray-900"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We respect your inbox. Unsubscribe anytime.
                </p>
              </div>
            </section>
          </section>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Blog page error:', error)

    // Fallback content when fetch fails
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-white backdrop-blur">
          <h1 className="text-3xl font-semibold">Blog</h1>
          <p className="mt-4 text-blue-100">Unable to load blog posts at this time.</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow transition-transform duration-200 hover:-translate-y-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }
}