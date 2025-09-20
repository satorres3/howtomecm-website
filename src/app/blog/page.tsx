import { Metadata } from 'next'
import { getPosts } from '../../lib/supabase'

const DOMAIN = process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com'

export const metadata: Metadata = {
  title: 'Blog - How to MeCM',
  description: 'Latest articles and insights about content management',
}

export default async function BlogPage() {
  const posts = await getPosts(DOMAIN)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover insights, tutorials, and best practices for content management
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts available yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Domain: {DOMAIN}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    <a href={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </a>
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                  {post.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-4">
                      {post.category}
                    </span>
                  )}
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}