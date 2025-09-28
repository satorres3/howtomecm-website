import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPostBySlug, getRecentPosts } from '../../../lib/content'
import type { Post } from '../../../../types/content'
import BlogPostContent from '@/components/blog/BlogPostContent'
import { findDemoPost, getDemoPosts } from '../../../lib/demoContent'
import { getPostWithSerializedContent } from '../../../lib/mdx'

interface BlogPostPageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()
  const { slug } = params

  const postResult = await getPostBySlug(DOMAIN, slug)
  if (postResult.success && postResult.data) {
    const post = postResult.data
    return {
      title: `${post.title} - How to MeCM`,
      description: post.excerpt || `Read about ${post.title}`,
    }
  }

  return {
    title: 'Blog Post - How to MeCM',
    description:
      'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()
  const { slug } = params

  const postResult = await getPostBySlug(DOMAIN, slug)
  let post = postResult.success && postResult.data ? postResult.data : null
  let mdxSource = null

  if (!post) {
    const mdxResult = await getPostWithSerializedContent(slug)
    if (mdxResult) {
      post = mdxResult.post as Post
      mdxSource = mdxResult.serializedContent
    } else {
      const demo = findDemoPost(slug)
      if (!demo) {
        notFound()
      }
      post = demo as Post
    }
  }

  const recentPostsResult = await getRecentPosts(DOMAIN, 5)
  const fetchedRelated: Post[] =
    recentPostsResult.success && recentPostsResult.data ? recentPostsResult.data : []
  const fallbackRelated = getDemoPosts().filter(p => p.slug !== slug)
  const relatedPosts = (fetchedRelated.length > 0 ? fetchedRelated : fallbackRelated)
    .filter(p => p.slug !== slug)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-12 text-white">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute left-8 top-6 h-16 w-16 rounded-full bg-white/20 blur-xl" />
          <div className="absolute bottom-6 right-8 h-20 w-20 rounded-full bg-purple-300/25 blur-2xl" />
        </div>
      </section>

      <main id="main-content" className="container-modern pb-24 lg:px-0">
        <div
          className="relative z-10 mb-6 flex items-center justify-between py-6"
          id="navigation-alignment-row"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-600 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all articles
          </Link>
          <div id="hide-navigation-placeholder"></div>
        </div>

        <div className="mx-auto -mt-12 max-w-6xl px-0">
          <BlogPostContent post={post} relatedPosts={relatedPosts} mdxSource={mdxSource} />
        </div>
      </main>
    </div>
  )
}
