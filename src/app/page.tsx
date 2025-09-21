import { Metadata } from 'next'
import { ContentLibrary } from '../../lib/content'
import ContentRenderer from '../components/ContentRenderer'
import type { Page, Post, ContentSection } from '../../types/content'

export const metadata: Metadata = {
  title: 'How to MeCM - Professional Microsoft Technology Consulting',
  description: 'Expert insights on Microsoft Configuration Manager (MECM/SCCM), Azure cloud technologies, and enterprise solutions. Professional consulting and best practices for IT professionals.',
  keywords: 'Microsoft Configuration Manager, MECM, SCCM, Azure, Microsoft 365, IT consulting, enterprise solutions, cloud technologies',
  authors: [{ name: 'How to MeCM Team' }],
  openGraph: {
    title: 'How to MeCM - Professional Microsoft Technology Consulting',
    description: 'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
    type: 'website',
    url: 'https://howtomecm.com',
    siteName: 'How to MeCM',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'How to MeCM - Microsoft Technology Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to MeCM - Professional Microsoft Technology Consulting',
    description: 'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()

// Helper function to convert page content to sections format
function getPageSections(page: Page): Array<{id: string, type: string, content: any}> {
  // Priority 1: Check if sections array exists
  if (page.sections && Array.isArray(page.sections)) {
    return page.sections
  }

  // Priority 2: Check if content is already an array of sections
  if (page.content && Array.isArray(page.content)) {
    return page.content
  }

  // Priority 3: Handle legacy string content
  if (page.content && typeof page.content === 'string') {
    return [{
      id: 'legacy-content',
      type: 'text',
      content: { text: page.content }
    }]
  }

  return []
}

export default async function HomePage() {
  // Try to get the home page content from CMS using enhanced content library
  const homePageResult = await ContentLibrary.getPageBySlug(DOMAIN, 'home')
  const recentPostsResult = await ContentLibrary.getRecentPosts(DOMAIN, 6)

  // Extract data with error handling
  const homePage = homePageResult.success ? homePageResult.data : null
  const recentPosts = recentPostsResult.success ? recentPostsResult.data || [] : []

  // If we have CMS content, render it
  if (homePage) {
    return (
      <main className="min-h-screen">
        <ContentRenderer
          title={homePage.title}
          sections={getPageSections(homePage)}
          seo={homePage.seo}
        />

        {/* Show recent posts if available */}
        {recentPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Latest Posts</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                    <a
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read More →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    )
  }

  // Professional tech blog fallback content inspired by Azure blog
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              How to MeCM
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Professional Microsoft Technology Consulting and Content Management Insights
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              Discover the latest in Microsoft Configuration Manager, cloud technologies,
              and enterprise solutions. Expert insights, best practices, and real-world implementations.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Content Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore Our Content
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Configuration Manager</h3>
              <p className="text-gray-600 mb-4">
                Deep dives into Microsoft Configuration Manager (MECM/SCCM), deployment strategies,
                and enterprise management solutions.
              </p>
              <a href="/blog?category=mecm" className="text-blue-600 hover:text-blue-800 font-medium">
                Explore MECM Articles →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Cloud Technologies</h3>
              <p className="text-gray-600 mb-4">
                Azure, Microsoft 365, and cloud-first approaches to modern IT infrastructure
                and application deployment.
              </p>
              <a href="/blog?category=cloud" className="text-blue-600 hover:text-blue-800 font-medium">
                Discover Cloud Solutions →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Best Practices</h3>
              <p className="text-gray-600 mb-4">
                Proven methodologies, implementation guides, and lessons learned from
                real-world enterprise deployments.
              </p>
              <a href="/blog?category=best-practices" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn Best Practices →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Placeholder */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Insights</h2>
            <p className="text-lg text-gray-600">
              Stay up to date with the latest Microsoft technologies and implementation strategies
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Content Management System Ready
            </h3>
            <p className="text-gray-600 mb-6">
              This professional tech blog is powered by a modern CMS.
              Articles will be dynamically loaded from the content management system.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/blog"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Explore Blog
              </a>
              <a
                href="#"
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                About Us
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Environment: {DOMAIN}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}