import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContentLibrary } from '../../../lib/content'
import type { Post } from '../../../../types/content'
import BlogPostContent from '@/components/blog/BlogPostContent'
import { findDemoPost, getDemoPosts } from '../../../lib/demoContent'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()
  const { slug } = await params

  try {
    const postResult = await ContentLibrary.getPostBySlug(DOMAIN, slug)

    if (postResult.success && postResult.data) {
      const post = postResult.data
      return {
        title: `${post.title} - How to MeCM`,
        description: post.excerpt || `Read about ${post.title}`,
      }
    }
  } catch (error) {
    // Suppress errors for demo posts - they have fallback handling
    if (process.env.NODE_ENV === 'development') {
      console.debug('CMS post not found, using demo fallback:', slug)
    }
  }

  return {
    title: 'Blog Post - How to MeCM',
    description: 'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()
  const { slug } = await params

  try {
    // Fetch the blog post
    const postResult = await ContentLibrary.getPostBySlug(DOMAIN, slug)

    let post = postResult.success && postResult.data ? postResult.data : null
    if (!post) {
      // Fallback to demo content for development/preview
      const demo = findDemoPost(slug)
      if (!demo) {
        notFound()
      }
      post = demo as Post

      // Only show fallback message in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Using demo content for post: ${slug}`)
      }
    }

    const recentPostsResult = await ContentLibrary.getRecentPosts(DOMAIN, 5)
    const fetchedRelated: Post[] = recentPostsResult.success ? (recentPostsResult.data || []) : []
    const fallbackRelated = getDemoPosts().filter(p => p.slug !== slug)
    const relatedPosts = (fetchedRelated.length > 0 ? fetchedRelated : fallbackRelated).filter(p => p.slug !== slug).slice(0, 4)

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-12 text-white">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-6 left-8 h-16 w-16 rounded-full bg-white/20 blur-xl" />
            <div className="absolute bottom-6 right-8 h-20 w-20 rounded-full bg-purple-300/25 blur-2xl" />
          </div>
        </section>

        <main id="main-content" className="container-modern pb-24 lg:px-0">
          {/* Navigation alignment row - positioned above the main content card */}
          <div className="flex justify-between items-center py-6 mb-6 relative z-10" id="navigation-alignment-row">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-600 backdrop-blur-sm border border-gray-200 transition-all duration-200 hover:bg-white hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900/80 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-900 dark:hover:border-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all articles
            </Link>
            <div id="hide-navigation-placeholder"></div>
          </div>

          <div className="mx-auto max-w-6xl px-0 -mt-12">
            <BlogPostContent post={post} relatedPosts={relatedPosts} />
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Blog post page error:', error)
    notFound()
  }
}
