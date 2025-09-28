import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { getAllPosts, getBlogPageContent, getCategories } from '../../lib/content'
import type { Post } from '../../../types/content'
import { getAllPosts as getMDXPosts } from '../../lib/mdx'
import BlogClientFilter from '@/components/blog/BlogClientFilter'
import type { BlogPageContent } from '@/types/site-content'

export const metadata: Metadata = {
  title: 'Blog - How to MeCM',
  description:
    'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
}

export default async function BlogPage() {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

  const postsResult = await getAllPosts(DOMAIN)
  const staticPosts: Post[] = postsResult.success && postsResult.data ? postsResult.data : []
  const mdxPosts = getMDXPosts()
  const posts: Post[] = [...staticPosts, ...mdxPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const categoriesResult = await getCategories(DOMAIN)
  const categories = categoriesResult.success && categoriesResult.data ? categoriesResult.data : []

  const blogContentResult = await getBlogPageContent()
  const blogContent: BlogPageContent | null = blogContentResult.success
    ? blogContentResult.data
    : null

  const heroTitle = blogContent?.hero.title || 'Latest insights from the How to MeCM team'
  const heroSubtitle =
    blogContent?.hero.subtitle ||
    'Deep dives, configuration walkthroughs, and battle-tested guidance for Microsoft Endpoint Configuration Manager, Intune, Azure, and the modern workplace.'
  const heroBadge = blogContent?.hero.badge || 'How to MeCM Blog'
  const heroPrimaryCta = blogContent?.hero.primaryCta
  const heroSecondaryCta = blogContent?.hero.secondaryCta

  const emptyState = blogContent?.emptyState

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main id="main-content" className="space-y-24">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-24 text-white">
          <div className="absolute inset-0 opacity-40" aria-hidden="true">
            <div className="absolute left-16 top-12 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute bottom-12 right-12 h-44 w-44 rounded-full bg-purple-300/25 blur-3xl" />
          </div>

          <div className="container-modern relative">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                {heroBadge}
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {heroTitle}
              </h1>
              <p className="mt-6 text-lg text-blue-100 md:text-xl">{heroSubtitle}</p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={heroPrimaryCta?.href || '/'}
                  className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-blue-50"
                >
                  {heroPrimaryCta?.label || 'Back to homepage'}
                </Link>
                <Link
                  href={heroSecondaryCta?.href || '#latest'}
                  className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/10"
                >
                  {heroSecondaryCta?.label || 'Jump to latest insights'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="container-modern">
              <div className="animate-pulse space-y-8">
                <div className="flex flex-wrap gap-3">
                  <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-12">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-96 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <BlogClientFilter posts={posts} categories={categories} />
        </Suspense>

        <section className="container-modern">
          <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white px-8 py-12 text-center shadow-xl transition-transform duration-200 hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto max-w-3xl space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                {emptyState?.title || 'Need a deep dive that is not here yet?'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {emptyState?.body ||
                  'Tell us about the deployment blockers or automation challenges you want covered next.'}
              </p>
              <Link
                href={emptyState?.cta?.href || '/contact'}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 dark:bg-white dark:text-gray-900"
              >
                {emptyState?.cta?.label || 'Request a walkthrough'}
              </Link>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}
