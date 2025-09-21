import { Metadata } from 'next'
import { ContentLibrary } from '../../../../lib/content'
import ContentRenderer from '../../../components/ContentRenderer'
import SocialShare from '../../../components/SocialShare'
import CommentSystem from '../../../components/CommentSystem'
import TableOfContents from '../../../components/TableOfContents'
import DarkModeToggle from '../../../components/DarkModeToggle'
import BackToTopButton from '../../../components/BackToTopButton'
import EngagementMetrics from '../../../components/EngagementMetrics'
import { notFound } from 'next/navigation'
import type { Post } from '../../../../types/content'
import { samplePosts } from '../../../data/samplePosts'
import { calculateReadingTime, formatReadingTime } from '../../../utils/readingTime'

const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

interface BlogPostProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static pages at build time
export async function generateStaticParams() {
  const postsResult = await ContentLibrary.getAllPosts(DOMAIN)
  let posts = postsResult.success ? postsResult.data || [] : []

  // If no CMS posts available, use sample posts
  if (posts.length === 0) {
    posts = samplePosts.map(post => ({
      ...post,
      status: 'published' as const,
      website_domain: DOMAIN,
      is_published_to_domain: true,
      updated_at: post.date,
      author: {
        ...post.author,
        id: `author-${post.author.email.split('@')[0]}`
      },
      tags: post.tags.map(tag => ({
        id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
        name: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-'),
        website_domain: DOMAIN,
        created_at: post.date
      })),
      category: post.category ? {
        id: `cat-${post.category.slug}`,
        name: post.category.name,
        slug: post.category.slug,
        website_domain: DOMAIN,
        created_at: post.date
      } : undefined
    }))
  }

  return posts.map(post => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const resolvedParams = await params
  const postResult = await ContentLibrary.getPostBySlug(DOMAIN, resolvedParams.slug)
  let post = postResult.success ? postResult.data : null

  // If no CMS post found, check sample posts
  if (!post) {
    const samplePost = samplePosts.find(p => p.slug === resolvedParams.slug)
    if (samplePost) {
      post = {
        ...samplePost,
        status: 'published' as const,
        website_domain: DOMAIN,
        is_published_to_domain: true,
        updated_at: samplePost.date,
        author: {
          ...samplePost.author,
          id: `author-${samplePost.author.email.split('@')[0]}`
        },
        tags: samplePost.tags.map(tag => ({
          id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
          name: tag,
          slug: tag.toLowerCase().replace(/\s+/g, '-'),
          website_domain: DOMAIN,
          created_at: samplePost.date
        })),
        category: samplePost.category ? {
          id: `cat-${samplePost.category.slug}`,
          name: samplePost.category.name,
          slug: samplePost.category.slug,
          website_domain: DOMAIN,
          created_at: samplePost.date
        } : undefined
      }
    }
  }

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const postUrl = `https://${DOMAIN}/blog/${post.slug}`
  const imageUrl = post.featured_image || `https://${DOMAIN}/og-image.jpg`

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || `Read about ${post.title}`,
    keywords: post.seo?.focusKeyword ? [post.seo.focusKeyword] : post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name),
    authors: post.author?.full_name ? [{ name: post.author.full_name }] : undefined,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || `Read about ${post.title}`,
      type: 'article',
      url: postUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date || post.created_at,
      modifiedTime: post.updated_at,
      authors: post.author?.full_name ? [post.author.full_name] : undefined,
      tags: post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || `Read about ${post.title}`,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const resolvedParams = await params
  const postResult = await ContentLibrary.getPostBySlug(DOMAIN, resolvedParams.slug)
  let post = postResult.success ? postResult.data : null

  // If no CMS post found, check sample posts
  if (!post) {
    const samplePost = samplePosts.find(p => p.slug === resolvedParams.slug)
    if (samplePost) {
      post = {
        ...samplePost,
        status: 'published' as const,
        website_domain: DOMAIN,
        is_published_to_domain: true,
        updated_at: samplePost.date,
        author: {
          ...samplePost.author,
          id: `author-${samplePost.author.email.split('@')[0]}`
        },
        tags: samplePost.tags.map(tag => ({
          id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
          name: tag,
          slug: tag.toLowerCase().replace(/\s+/g, '-'),
          website_domain: DOMAIN,
          created_at: samplePost.date
        })),
        category: samplePost.category ? {
          id: `cat-${samplePost.category.slug}`,
          name: samplePost.category.name,
          slug: samplePost.category.slug,
          website_domain: DOMAIN,
          created_at: samplePost.date
        } : undefined
      }
    }
  }

  if (!post) {
    notFound()
  }

  // Get related posts (same category or tags)
  const allPostsResult = await ContentLibrary.getAllPosts(DOMAIN)
  let allPosts = allPostsResult.success ? allPostsResult.data || [] : []

  // If no CMS posts available, use sample posts
  if (allPosts.length === 0) {
    allPosts = samplePosts.map(p => ({
      ...p,
      status: 'published' as const,
      website_domain: DOMAIN,
      is_published_to_domain: true,
      updated_at: p.date,
      author: {
        ...p.author,
        id: `author-${p.author.email.split('@')[0]}`
      },
      tags: p.tags.map(tag => ({
        id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
        name: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-'),
        website_domain: DOMAIN,
        created_at: p.date
      })),
      category: p.category ? {
        id: `cat-${p.category.slug}`,
        name: p.category.name,
        slug: p.category.slug,
        website_domain: DOMAIN,
        created_at: p.date
      } : undefined
    }))
  }

  const relatedPosts = allPosts
    .filter(p => p.id !== post.id)
    .filter(p =>
      (post.category?.name && p.category?.name === post.category.name) ||
      (post.tags && post.tags.some(tag => p.tags?.includes(tag)))
    )
    .slice(0, 3)

  const postUrl = `https://${DOMAIN}/blog/${post.slug}`
  const shareText = encodeURIComponent(post.title)

  const postContent = post.content || ''
  const readingTime = calculateReadingTime(postContent)

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Clean, Structured Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          {/* Navigation and Dark Mode Toggle */}
          <div className="flex justify-between items-center mb-8">
            <nav>
              <a href="/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </a>
            </nav>
            <DarkModeToggle />
          </div>

          {/* Title Section - Full Width */}
          <div className="max-w-5xl mx-auto mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Post Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.date || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {post.author?.full_name && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  by {post.author.full_name}
                </span>
              )}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatReadingTime(readingTime)}
              </span>
              {post.category?.name && (
                <a
                  href={`/blog?category=${encodeURIComponent(post.category.name)}`}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {post.category.name}
                </a>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-4xl">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Engagement Metrics */}
          <div className="max-w-5xl mx-auto">
            <EngagementMetrics
              postId={post.id}
              title={post.title}
              url={postUrl}
              className="mb-6"
            />
          </div>
        </div>
      </header>

      {/* Featured Image - Full Width */}
      {post.featured_image && (
        <div className="w-full h-96 md:h-[32rem] relative overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}

      {/* Main Content Area - Better Screen Usage */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">

            {/* Table of Contents - Sidebar */}
            <aside className="xl:col-span-1 order-2 xl:order-1">
              <div className="xl:sticky xl:top-8">
                <TableOfContents content={postContent} />
              </div>
            </aside>

            {/* Main Content */}
            <main className="xl:col-span-4 order-1 xl:order-2">
              {/* Content Body */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
                <div className="p-8 lg:p-12">
                  {post.sections && post.sections.length > 0 ? (
                    post.sections.map((section: any, index: number) => (
                      <ContentRenderer
                        key={section.id || index}
                        title=""
                        sections={[section]}
                        seo={post.seo}
                      />
                    ))
                  ) : (
                    <div className="prose prose-xl max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
                      {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No content available for this post.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, index: number) => {
                      const tagName = typeof tag === 'string' ? tag : tag.name
                      return (
                        <a
                          key={index}
                          href={`/blog?tag=${encodeURIComponent(tagName)}`}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                        >
                          #{tagName}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Author Section */}
              {post.author && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About the Author</h3>
                  <div className="flex items-center space-x-6">
                    {post.author.avatar_url ? (
                      <img
                        src={post.author.avatar_url}
                        alt={post.author.full_name}
                        className="w-20 h-20 rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {post.author.full_name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{post.author.full_name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">Content Author</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="mb-12">
                <CommentSystem
                  postId={post.id}
                  postTitle={post.title}
                  moderationEnabled={true}
                  allowReplies={true}
                />
              </div>

              {/* Related Posts - Better Card Layout */}
              {relatedPosts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Related Posts
                  </h3>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {relatedPosts.map((relatedPost) => (
                      <article key={relatedPost.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        {relatedPost.featured_image && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
                            <a href={`/blog/${relatedPost.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {relatedPost.title}
                            </a>
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {new Date(relatedPost.date || relatedPost.created_at).toLocaleDateString()}
                          </p>
                          {relatedPost.category?.name && (
                            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                              {relatedPost.category.name}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center">
                  <a
                    href="/blog"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    All Posts
                  </a>
                  <BackToTopButton />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </article>
  )
}