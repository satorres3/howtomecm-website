import { Metadata } from 'next'
import Link from 'next/link'
import { ContentLibrary } from '../../../../lib/content'
import ContentRenderer from '../../../components/ContentRenderer'
import SocialShare from '../../../components/SocialShare'
import CommentSystem from '../../../components/CommentSystem'
import TableOfContents from '../../../components/TableOfContents'
import DarkModeToggle from '../../../components/DarkModeToggle'
import BackToTopButton from '../../../components/BackToTopButton'
import EngagementMetrics from '../../../components/EngagementMetrics'
import CopyButton from '../../../components/CopyButton'
import { notFound } from 'next/navigation'
import type { Post } from '../../../../types/content'
import { samplePosts } from '../../../data/samplePosts'
import { calculateReadingTime, formatReadingTime } from '../../../utils/readingTime'
import { processContentForTOC } from '../../../utils/contentProcessor'

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

  // Process content to add IDs to headings and extract TOC items
  const { processedContent, tocItems } = processContentForTOC(postContent)

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Clean Navigation Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <nav>
              <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </a>
            </nav>
            <DarkModeToggle />
          </div>
        </div>
      </header>


      {/* Two-Column Reading Layout */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">

            {/* Reader's Cockpit - Left Sidebar */}
            <aside className="lg:col-span-1 bg-white dark:bg-gray-800 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto order-2 lg:order-1">
              <div className="p-6 space-y-8">


                {/* Dynamic Table of Contents */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Contents</h3>
                  <TableOfContents tocItems={tocItems} />
                </div>

                {/* YouTube Promotion Card */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center -space-x-2">
                      <img
                        src="https://assets.zyrosite.com/A0xw0LoMOVtarQa0/how-to-mk3zRRxqrQFyKNnl.gif"
                        alt="How to MeCM"
                        className="w-8 h-8 object-contain bg-white rounded-lg border-2 border-white shadow-sm z-10"
                      />
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">How to MeCM</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">YouTube Channel</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">Watch detailed video tutorials and implementation guides</p>
                  <a
                    href="https://youtube.com/channel/UCAceM2bfmSUfCwJ03TB2cjg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>Subscribe & Watch</span>
                  </a>
                </div>

                {/* Related Posts */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Related Posts</h3>
                  <div className="space-y-4">
                    {/* Show more related posts */}
                    {allPosts
                      .filter(p => p.id !== post.id)
                      .filter(p =>
                        (post.category?.name && p.category?.name === post.category.name) ||
                        (post.tags && post.tags.some(tag => {
                          const tagName = typeof tag === 'string' ? tag : tag.name;
                          return p.tags?.some(pTag => {
                            const pTagName = typeof pTag === 'string' ? pTag : pTag.name;
                            return pTagName === tagName;
                          });
                        }))
                      )
                      .slice(0, 5)
                      .map((relatedPost, index) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="block group">
                        <article className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-100 dark:border-gray-600">
                          <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-lg mb-3 overflow-hidden">
                            <img
                              src={relatedPost.featured_image || `https://images.unsplash.com/photo-${['1517180102446-f3ece451e9d8', '1560520653-a1f9e72bbaa5', '1573496359142-b8b25c0c5ee7', '1498050108023-c5e6f2bdc15b', '1451187580459-43d4fe3f14a5'][index % 5]}?w=300&h=200&fit=crop`}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {new Date(relatedPost.date).toLocaleDateString()}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {Math.ceil(Math.random() * 8 + 2)} min read
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </aside>

            {/* Reading Pane - Main Content Area */}
            <main className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 min-h-screen">
                <div className="max-w-4xl mx-auto px-8 py-12">

                  {/* Content Header - Streamlined */}
                  <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {post.category?.name || 'Article'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                      {post.title}
                    </h1>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                      <div className="flex items-center space-x-2">
                        {post.author?.avatar_url ? (
                          <img
                            src={post.author.avatar_url}
                            alt={post.author.full_name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {post.author?.full_name?.charAt(0) || 'A'}
                          </div>
                        )}
                        <span>By {post.author?.full_name || 'Anonymous'}</span>
                      </div>
                      <span>•</span>
                      <span>{formatReadingTime(readingTime)}</span>
                      <span>•</span>
                      <span>Last updated {new Date(post.updated_at || post.date).toLocaleDateString()}</span>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="mb-8">
                      <EngagementMetrics
                        postId={post.id}
                        title={post.title}
                        url={postUrl}
                        className=""
                      />
                    </div>

                    {post.excerpt && (
                      <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Featured Image */}
                    {post.featured_image && (
                      <div className="w-full h-64 md:h-80 relative overflow-hidden rounded-xl mb-8">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <article className="prose prose-xl prose-enhanced max-w-none dark:prose-invert
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                    [&>div]:mb-8 [&>div>*]:mb-4">
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
                      <div>
                        {processedContent ? (
                          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">No content available for this post.</p>
                        )}
                      </div>
                    )}

                    {/* Article Footer - Tags, Author, Share */}
                    <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index: number) => {
                              const tagName = typeof tag === 'string' ? tag : tag.name
                              return (
                                <a
                                  key={index}
                                  href={`/blog?tag=${encodeURIComponent(tagName)}`}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  #{tagName}
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Author Bio */}
                      {post.author && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About the Author</h3>
                          <div className="flex items-start space-x-4">
                            {post.author.avatar_url ? (
                              <img
                                src={post.author.avatar_url}
                                alt={post.author.full_name}
                                className="w-16 h-16 rounded-full"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {post.author.full_name?.charAt(0) || 'A'}
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{post.author.full_name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Microsoft technology expert with 15+ years of experience in enterprise environments.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Share Section */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this article</h3>
                        <div className="flex items-center space-x-4">
                          <a
                            href={`https://www.linkedin.com/feed/update/urn:li:share/?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-[#0077B5] hover:bg-[#005885] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <span>LinkedIn</span>
                          </a>
                          <CopyButton
                            text={postUrl}
                            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Link</span>
                          </CopyButton>
                        </div>
                      </div>

                    </footer>
                  </article>

                  {/* Comments Section */}
                  <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <CommentSystem
                      postId={post.id}
                      postTitle={post.title}
                      moderationEnabled={true}
                      allowReplies={true}
                    />
                  </div>

                </div>
              </div>
            </main>

          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
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
      </div>
    </article>
  )
}