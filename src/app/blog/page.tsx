import { Metadata } from 'next'
import { ContentLibrary } from '../../../lib/content'
import type { Post } from '../../../types/content'
import { calculateReadingTime, formatReadingTime } from '../../utils/readingTime'
import { samplePosts } from '../../data/samplePosts'
import ModernBlogCard from '../../components/ModernBlogCard'

const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    tag?: string
  }>
}

// Generate metadata with dynamic content
export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams
  const postsResult = await ContentLibrary.getAllPosts(DOMAIN)
  const posts = postsResult.success ? postsResult.data || [] : []

  let title = 'Blog - How to MeCM'
  let description = 'Latest articles and insights about content management'

  if (resolvedParams.category) {
    title = `${resolvedParams.category} Articles - How to MeCM`
    description = `Latest articles in the ${resolvedParams.category} category`
  } else if (resolvedParams.tag) {
    title = `${resolvedParams.tag} Posts - How to MeCM`
    description = `Posts tagged with ${resolvedParams.tag}`
  } else if (resolvedParams.page) {
    title = `Blog - Page ${resolvedParams.page} - How to MeCM`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${DOMAIN}/blog`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page || '1', 10)
  const postsPerPage = 6
  const category = resolvedParams.category
  const tag = resolvedParams.tag

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

  // Filter by category if specified
  if (category) {
    posts = posts.filter(post =>
      post.category?.name?.toLowerCase() === category.toLowerCase()
    )
  }

  // Filter by tag if specified
  if (tag) {
    posts = posts.filter(post =>
      post.tags?.some(postTag => {
        const tagName = typeof postTag === 'string' ? postTag : postTag.name
        return tagName.toLowerCase() === tag.toLowerCase()
      })
    )
  }

  // Pagination
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  // Get all categories and tags for filters
  const categorySet = new Set(posts.map(post => post.category?.name).filter((name): name is string => Boolean(name)))
  const allCategories = Array.from(categorySet)

  const tagSet = new Set(posts.flatMap(post => (post.tags || []).map(tag => typeof tag === 'string' ? tag : tag.name)))
  const allTags = Array.from(tagSet)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white section-padding">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container-modern relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {category ? `${category} Articles` : tag ? `Posts tagged "${tag}"` : 'Professional Tech Blog'}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {category
                ? `Expert insights and best practices in ${category}`
                : tag
                ? `All content related to ${tag}`
                : 'Discover the latest in Microsoft technologies, configuration management, and enterprise solutions'
              }
            </p>

            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      <div className="container-modern section-padding">
        {/* Modern Breadcrumb */}
        <nav className="mb-8 animate-slide-up">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-blue-600 transition-colors duration-200">Home</a></li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li><a href="/blog" className="hover:text-blue-600 transition-colors duration-200">Blog</a></li>
            {category && (
              <>
                <li>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="text-gray-900 font-medium">{category}</li>
              </>
            )}
            {tag && (
              <>
                <li>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="text-gray-900 font-medium">#{tag}</li>
              </>
            )}
          </ol>
        </nav>

        {/* Modern Filters */}
        {(allCategories.length > 0 || allTags.length > 0) && (
          <div className="mb-12 card-modern p-8 animate-slide-up stagger-delay-1">
            <div className="flex flex-wrap gap-6">
              {/* Category filters */}
              {allCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/blog"
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        !category && !tag
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
                      }`}
                    >
                      All Posts
                    </a>
                    {allCategories.map((cat) => (
                      <a
                        key={cat}
                        href={`/blog?category=${encodeURIComponent(cat)}`}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          category === cat
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
                        }`}
                      >
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag filters */}
              {allTags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Popular Tags</h3>
                  <div className="flex flex-wrap gap-3">
                    {allTags.slice(0, 10).map((tagName) => (
                      <a
                        key={tagName}
                        href={`/blog?tag=${encodeURIComponent(tagName)}`}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          tag === tagName
                            ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105'
                        }`}
                      >
                        #{tagName}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modern Results Summary */}
        <div className="mb-8 flex items-center justify-between animate-slide-up stagger-delay-2">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{currentPosts.length}</span> of <span className="font-semibold text-gray-900">{totalPosts}</span> posts
            {totalPages > 1 && (
              <span className="text-gray-400"> • Page {page} of {totalPages}</span>
            )}
          </div>

          {/* View Toggle (for future enhancement) */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">View</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="p-1 rounded bg-white shadow-sm">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {currentPosts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category || tag ? 'No posts found' : 'No posts available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {category || tag ? 'No posts found matching your filter criteria.' : 'No blog posts available yet. Check back soon!'}
              </p>
              {(category || tag) && (
                <a href="/blog" className="btn-primary">
                  ← View all posts
                </a>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {currentPosts.length > 0 && (
              <div className="mb-16 animate-fade-in">
                <ModernBlogCard
                  post={currentPosts[0]}
                  variant="featured"
                  className="stagger-delay-1"
                />
              </div>
            )}

            {/* Regular Posts Grid */}
            {currentPosts.length > 1 && (
              <div className="grid-auto-fit mb-16">
                {currentPosts.slice(1).map((post, index) => (
                  <div key={post.id} className="animate-slide-up" style={{animationDelay: `${(index + 2) * 100}ms`}}>
                    <ModernBlogCard
                      post={post}
                      variant="default"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 animate-fade-in">
                {page > 1 && (
                  <a
                    href={`/blog?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </a>
                )}

                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (page <= 4) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = page - 3 + i;
                    }

                    return (
                      <a
                        key={pageNum}
                        href={`/blog?page=${pageNum}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${
                          pageNum === page
                            ? 'bg-blue-600 text-white shadow-lg transform scale-110'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:scale-105'
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                </div>

                {page < totalPages && (
                  <a
                    href={`/blog?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                  >
                    Next
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}