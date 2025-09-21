import { Metadata } from 'next'
import { ContentLibrary } from '../../../lib/content'
import type { Post } from '../../../types/content'

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
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category ? `${category} Articles` : tag ? `Posts tagged "${tag}"` : 'Professional Tech Blog'}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {category
                ? `Expert insights and best practices in ${category}`
                : tag
                ? `All content related to ${tag}`
                : 'Discover the latest in Microsoft technologies, configuration management, and enterprise solutions'
              }
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li>/</li>
            <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
            {category && (
              <>
                <li>/</li>
                <li className="text-gray-900">{category}</li>
              </>
            )}
            {tag && (
              <>
                <li>/</li>
                <li className="text-gray-900">#{tag}</li>
              </>
            )}
          </ol>
        </nav>

        {/* Filters */}
        {(allCategories.length > 0 || allTags.length > 0) && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap gap-4">
              {/* Category filters */}
              {allCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/blog"
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        !category && !tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </a>
                    {allCategories.map((cat) => (
                      <a
                        key={cat}
                        href={`/blog?category=${encodeURIComponent(cat)}`}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          category === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  <h3 className="font-semibold text-gray-900 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 10).map((tagName) => (
                      <a
                        key={tagName}
                        href={`/blog?tag=${encodeURIComponent(tagName)}`}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          tag === tagName
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

        {/* Results summary */}
        <div className="mb-6 text-sm text-gray-600">
          Showing {currentPosts.length} of {totalPosts} posts
          {totalPages > 1 && ` (page ${page} of ${totalPages})`}
        </div>

        {currentPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {category || tag ? 'No posts found matching your filter.' : 'No blog posts available yet.'}
            </p>
            {(category || tag) && (
              <a href="/blog" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                ← View all posts
              </a>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Domain: {DOMAIN}
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post (first post) */}
            {currentPosts.length > 0 && (
              <article className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  {currentPosts[0].featured_image && (
                    <div className="md:w-1/2">
                      <img
                        src={currentPosts[0].featured_image}
                        alt={currentPosts[0].title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-8 ${currentPosts[0].featured_image ? 'md:w-1/2' : 'w-full'}`}>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-3">
                        Featured
                      </span>
                      <time dateTime={currentPosts[0].date || currentPosts[0].created_at}>
                        {new Date(currentPosts[0].date || currentPosts[0].created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      {currentPosts[0].author?.full_name && (
                        <span className="ml-2">by {currentPosts[0].author.full_name}</span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                      <a href={`/blog/${currentPosts[0].slug}`} className="hover:text-blue-600 transition-colors">
                        {currentPosts[0].title}
                      </a>
                    </h2>
                    {currentPosts[0].excerpt && (
                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        {currentPosts[0].excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentPosts[0].category?.name && (
                        <a
                          href={`/blog?category=${encodeURIComponent(currentPosts[0].category.name)}`}
                          className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          {currentPosts[0].category.name}
                        </a>
                      )}
                      {currentPosts[0].tags?.slice(0, 3).map((tag, index) => {
                        const tagName = typeof tag === 'string' ? tag : tag.name
                        return (
                        <a
                          key={index}
                          href={`/blog?tag=${encodeURIComponent(tagName)}`}
                          className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          #{tagName}
                        </a>
                        )
                      })}
                    </div>
                    <a
                      href={`/blog/${currentPosts[0].slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      Read Full Article
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            )}

            {/* Regular Posts Grid */}
            {currentPosts.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentPosts.slice(1).map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                    {post.featured_image && (
                      <div className="relative overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <time dateTime={post.date || post.created_at}>
                          {new Date(post.date || post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                        {post.author?.full_name && (
                          <span className="ml-2">by {post.author.full_name}</span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold mb-3 text-gray-900 leading-tight">
                        <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </a>
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.category?.name && (
                          <a
                            href={`/blog?category=${encodeURIComponent(post.category.name)}`}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            {post.category.name}
                          </a>
                        )}
                        {post.tags?.slice(0, 2).map((tag, index) => {
                          const tagName = typeof tag === 'string' ? tag : tag.name
                          return (
                          <a
                            key={index}
                            href={`/blog?tag=${encodeURIComponent(tagName)}`}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            #{tagName}
                          </a>
                          )
                        })}
                      </div>
                      <a
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                      >
                        Read More
                        <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                {page > 1 && (
                  <a
                    href={`/blog?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    ← Previous
                  </a>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <a
                    key={pageNum}
                    href={`/blog?page=${pageNum}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </a>
                ))}

                {page < totalPages && (
                  <a
                    href={`/blog?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ''}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Next →
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