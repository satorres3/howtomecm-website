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
      {/* Featured Article Hero Section - Azure Style */}
      <section className="relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-800/90"></div>
        <div className="relative bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
          <div className="relative container mx-auto px-4 py-24">
            <div className="max-w-4xl">
              <div className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
                Featured Article
              </div>
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                The Future of Microsoft Configuration Manager
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                Discover how MECM is evolving to meet modern enterprise needs with cloud integration,
                co-management strategies, and next-generation device management capabilities.
              </p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">HM</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">How to MeCM Team</div>
                    <div className="text-blue-200 text-sm">Microsoft Technology Experts</div>
                  </div>
                </div>
                <div className="text-blue-200 text-sm">
                  <span>5 min read</span> • <span>Updated 2 days ago</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <a
                  href="/blog/future-of-mecm"
                  className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
                >
                  Read Full Article
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/blog"
                  className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
                >
                  View All Articles
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics - Azure Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay ahead with the latest Microsoft technologies, implementation strategies, and enterprise solutions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Primary Feature Card */}
            <div className="lg:col-span-2">
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative">
                  <div className="text-sm font-semibold text-blue-200 mb-3 uppercase tracking-wide">
                    Configuration Manager
                  </div>
                  <h3 className="text-3xl font-bold mb-4 leading-tight">
                    MECM Co-Management: Bridging On-Premises and Cloud
                  </h3>
                  <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                    Learn how to implement co-management strategies that seamlessly integrate traditional SCCM with modern Intune capabilities for hybrid device management.
                  </p>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-blue-200 text-sm">12 min read</span>
                    <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                    <span className="text-blue-200 text-sm">Expert Level</span>
                  </div>
                  <a href="/blog?category=mecm" className="inline-flex items-center bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Read More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Secondary Cards */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
                <div className="text-sm font-semibold text-emerald-200 mb-2 uppercase tracking-wide">
                  Azure Solutions
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight">
                  Azure Arc for Hybrid Infrastructure
                </h3>
                <p className="text-emerald-100 mb-4 text-sm">
                  Extend Azure services and management to any infrastructure with Azure Arc's unified control plane.
                </p>
                <a href="/blog?category=azure" className="text-white font-medium hover:text-emerald-200 transition-colors">
                  Learn More →
                </a>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
                <div className="text-sm font-semibold text-purple-200 mb-2 uppercase tracking-wide">
                  PowerShell
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight">
                  PowerShell DSC for Configuration Management
                </h3>
                <p className="text-purple-100 mb-4 text-sm">
                  Automate and maintain system configurations at scale using Desired State Configuration.
                </p>
                <a href="/blog?category=powershell" className="text-white font-medium hover:text-purple-200 transition-colors">
                  Explore Scripts →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solutions by Technology
            </h2>
            <p className="text-xl text-gray-600">
              Deep dive into specific Microsoft technologies and implementation approaches
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Configuration Manager</h3>
              <p className="text-gray-600 text-sm mb-4">MECM/SCCM deployment, management, and optimization strategies</p>
              <a href="/blog?category=mecm" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Articles →
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Azure Cloud</h3>
              <p className="text-gray-600 text-sm mb-4">Modern cloud solutions, migration strategies, and hybrid setups</p>
              <a href="/blog?category=azure" className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">
                Explore Azure →
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Microsoft Intune</h3>
              <p className="text-gray-600 text-sm mb-4">Mobile device management and modern endpoint protection</p>
              <a href="/blog?category=intune" className="text-purple-600 hover:text-purple-800 font-medium text-sm">
                Learn Intune →
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">PowerShell</h3>
              <p className="text-gray-600 text-sm mb-4">Automation scripts, DSC configurations, and advanced scripting</p>
              <a href="/blog?category=powershell" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                View Scripts →
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