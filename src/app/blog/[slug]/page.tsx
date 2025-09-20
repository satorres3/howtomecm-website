import { Metadata } from 'next'
import { getPostBySlug, getPosts } from '../../../lib/supabase'
import ContentRenderer from '../../../components/ContentRenderer'
import { notFound } from 'next/navigation'

const DOMAIN = process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com'

interface BlogPostProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await getPosts(DOMAIN)

  return posts.map(post => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPostBySlug(DOMAIN, resolvedParams.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || `Read about ${post.title}`,
    keywords: post.seo?.focusKeyword ? [post.seo.focusKeyword] : undefined,
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(DOMAIN, resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen">
      {/* Blog post header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <nav className="mb-4">
            <a href="/blog" className="text-blue-600 hover:text-blue-800">
              ← Back to Blog
            </a>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            {post.category && (
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                {post.category}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content sections */}
      <div className="container mx-auto px-4 py-8">
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
          <div className="prose max-w-none">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-gray-600">No content available for this post.</p>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}