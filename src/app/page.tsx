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

  // Professional tech blog content matching Azure blog template
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Featured Content */}
      <section className="bg-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Featured Articles Grid */}
          <div className="grid lg:grid-cols-12 gap-8 mb-16">
            {/* Main Featured Article */}
            <div className="lg:col-span-8">
              <article className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative p-8 text-white min-h-[400px] flex flex-col justify-end">
                  <div className="mb-4">
                    <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded uppercase tracking-wide font-medium">
                      Microsoft Configuration Manager
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    Modernizing IT Infrastructure with MECM Co-Management
                  </h1>
                  <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                    Discover how organizations are successfully bridging traditional on-premises management with modern cloud-first approaches using Microsoft Configuration Manager and Intune co-management.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-blue-200">
                    <span>December 18, 2024</span>
                    <span>•</span>
                    <span>8 min read</span>
                  </div>
                </div>
              </article>
            </div>

            {/* Secondary Featured Articles */}
            <div className="lg:col-span-4 space-y-6">
              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-emerald-500 to-emerald-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mb-3">
                    Azure Cloud
                  </span>
                  <h2 className="text-xl font-bold mb-2 text-gray-900">
                    Azure Arc: Extending Cloud Management Everywhere
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn how Azure Arc enables unified management across on-premises, multi-cloud, and edge environments.
                  </p>
                  <div className="text-xs text-gray-500">
                    December 15, 2024 • 6 min read
                  </div>
                </div>
              </article>

              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-3">
                    PowerShell
                  </span>
                  <h2 className="text-xl font-bold mb-2 text-gray-900">
                    PowerShell DSC for Enterprise Configuration
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Automate and maintain consistent system configurations at scale with Desired State Configuration.
                  </p>
                  <div className="text-xs text-gray-500">
                    December 12, 2024 • 10 min read
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections - Azure Blog Style */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hear from our experts */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Hear from our Microsoft experts
              </h2>
              <a href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
                See all recent posts →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                    MECM
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    Advanced MECM Deployment Strategies
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn enterprise-grade deployment techniques for large-scale Configuration Manager environments.
                  </p>
                  <div className="text-xs text-gray-500">
                    December 10, 2024 • 12 min read
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-emerald-500 to-emerald-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mb-3">
                    Azure
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    Cloud Migration Best Practices
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Essential strategies for successful Azure migration projects in enterprise environments.
                  </p>
                  <div className="text-xs text-gray-500">
                    December 8, 2024 • 9 min read
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-3">
                    Intune
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    Modern Device Management
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Implementing zero-trust security with Microsoft Intune for modern workplace scenarios.
                  </p>
                  <div className="text-xs text-gray-500">
                    December 5, 2024 • 7 min read
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Configuration Manager and cloud technologies */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Configuration Manager and cloud technologies
              </h2>
              <a href="/blog?category=mecm" className="text-blue-600 hover:text-blue-800 font-medium">
                See all MECM posts →
              </a>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-500"></div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">
                    MECM Troubleshooting Guide
                  </h3>
                  <div className="text-xs text-gray-500">
                    December 3, 2024 • 15 min read
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-indigo-400 to-indigo-500"></div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">
                    Co-Management Implementation
                  </h3>
                  <div className="text-xs text-gray-500">
                    November 28, 2024 • 11 min read
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-cyan-400 to-cyan-500"></div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">
                    Patch Management Strategies
                  </h3>
                  <div className="text-xs text-gray-500">
                    November 25, 2024 • 8 min read
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-teal-400 to-teal-500"></div>
                <div className="p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-900">
                    Application Deployment Automation
                  </h3>
                  <div className="text-xs text-gray-500">
                    November 22, 2024 • 13 min read
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* PowerShell and automation */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                PowerShell and automation
              </h2>
              <a href="/blog?category=powershell" className="text-blue-600 hover:text-blue-800 font-medium">
                See all PowerShell posts →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-violet-500 to-violet-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded mb-3">
                    PowerShell
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    DSC Configuration Templates
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Ready-to-use PowerShell DSC configurations for common enterprise scenarios.
                  </p>
                  <div className="text-xs text-gray-500">
                    November 20, 2024 • 10 min read
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-rose-500 to-rose-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded mb-3">
                    Automation
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    Azure Automation Runbooks
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Building robust automation workflows with Azure Automation and PowerShell.
                  </p>
                  <div className="text-xs text-gray-500">
                    November 18, 2024 • 14 min read
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-amber-500 to-amber-600"></div>
                <div className="p-6">
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded mb-3">
                    Scripts
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">
                    Advanced PowerShell Techniques
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Professional scripting patterns and error handling for production environments.
                  </p>
                  <div className="text-xs text-gray-500">
                    November 15, 2024 • 16 min read
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}