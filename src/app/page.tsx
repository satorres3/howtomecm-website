import { Metadata } from 'next'
import { ContentLibrary } from '../../lib/content'
import ContentRenderer from '../components/ContentRenderer'
import RotatingBlogPosts from '../components/RotatingBlogPosts'
import ModernBlogCard from '../components/ModernBlogCard'
import type { Page, Post, ContentSection } from '../../types/content'
import { samplePosts } from '../data/samplePosts'

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

  // Professional tech blog content with dynamic sample posts
  const featuredPost = samplePosts[0] // MECM Co-Management post
  const secondaryPosts = samplePosts.slice(1, 3) // Azure Arc and PowerShell DSC
  const recentPostsSection = samplePosts.slice(3, 6) // Latest 3 posts

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Hero Section with Rotating Blog Posts */}
      <section className="section-padding">
        <div className="container-modern">
          {/* Welcome Message */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Professional Microsoft Technology{' '}
              <span className="text-gradient">Consulting</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Expert insights on Microsoft Configuration Manager (MECM/SCCM), Azure cloud technologies,
              and enterprise solutions. Professional consulting and best practices for IT professionals.
            </p>
          </div>

          {/* Rotating Blog Posts Hero */}
          <div className="mb-16 animate-slide-up stagger-delay-1">
            <RotatingBlogPosts
              posts={samplePosts.slice(0, 4)}
              autoRotate={true}
              rotationInterval={7000}
              showThumbnails={true}
            />
          </div>
        </div>
      </section>

      {/* Modern Content Sections */}
      <section className="section-padding bg-white">
        <div className="container-modern">
          {/* Hear from our experts */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12 animate-fade-in">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Hear from our Microsoft experts
                </h2>
                <p className="text-gray-600 text-lg">
                  Latest insights and best practices from our certified professionals
                </p>
              </div>
              <a href="/blog" className="btn-ghost group">
                See all posts
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentPostsSection.map((post, index) => (
                <div key={post.id} className="animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                  <ModernBlogCard
                    post={post}
                    variant="default"
                    showAuthor={true}
                    showExcerpt={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Manager and cloud technologies */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12 animate-fade-in">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Configuration Manager and cloud technologies
                </h2>
                <p className="text-gray-600 text-lg">
                  Expert guidance on MECM deployment, configuration, and optimization
                </p>
              </div>
              <a href="/blog?category=mecm" className="btn-ghost group">
                See all MECM posts
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="card-modern overflow-hidden group animate-slide-up">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&crop=center"
                    alt="MECM Troubleshooting"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    MECM Troubleshooting Guide
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>December 3, 2024</span>
                    <span>•</span>
                    <span>15 min read</span>
                  </div>
                </div>
              </article>

              <article className="card-modern overflow-hidden group animate-slide-up stagger-delay-1">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&crop=center"
                    alt="Co-Management Implementation"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    Co-Management Implementation
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>November 28, 2024</span>
                    <span>•</span>
                    <span>11 min read</span>
                  </div>
                </div>
              </article>

              <article className="card-modern overflow-hidden group animate-slide-up stagger-delay-2">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center"
                    alt="Patch Management"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    Patch Management Strategies
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>November 25, 2024</span>
                    <span>•</span>
                    <span>8 min read</span>
                  </div>
                </div>
              </article>

              <article className="card-modern overflow-hidden group animate-slide-up stagger-delay-3">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop&crop=center"
                    alt="Application Deployment"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    Application Deployment Automation
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>November 22, 2024</span>
                    <span>•</span>
                    <span>13 min read</span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* PowerShell and automation */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12 animate-fade-in">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  PowerShell and automation
                </h2>
                <p className="text-gray-600 text-lg">
                  Powerful automation solutions and advanced scripting techniques
                </p>
              </div>
              <a href="/blog?category=powershell" className="btn-ghost group">
                See all PowerShell posts
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <article className="card-modern overflow-hidden group animate-slide-up">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop&crop=center"
                    alt="PowerShell DSC"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-violet-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      PowerShell
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                    DSC Configuration Templates
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Ready-to-use PowerShell DSC configurations for common enterprise scenarios.
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>November 20, 2024</span>
                    <span>•</span>
                    <span>10 min read</span>
                  </div>
                </div>
              </article>

              <article className="card-modern overflow-hidden group animate-slide-up stagger-delay-1">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center"
                    alt="Azure Automation"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-rose-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Automation
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-rose-600 transition-colors duration-300">
                    Azure Automation Runbooks
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Building robust automation workflows with Azure Automation and PowerShell.
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>November 18, 2024</span>
                    <span>•</span>
                    <span>14 min read</span>
                  </div>
                </div>
              </article>

              <article className="card-modern overflow-hidden group animate-slide-up stagger-delay-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500&h=300&fit=crop&crop=center"
                    alt="Advanced PowerShell"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Scripts
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    Advanced PowerShell Techniques
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Professional scripting patterns and error handling for production environments.
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>November 15, 2024</span>
                    <span>•</span>
                    <span>16 min read</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className="relative section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container-modern text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to accelerate your Microsoft technology journey?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get expert guidance on Configuration Manager, Azure, and modern device management.
              Transform your IT infrastructure with proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="/contact" className="btn-secondary bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                Get Expert Consultation
              </a>
              <a href="/blog" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-xl font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105">
                Explore Our Insights
              </a>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

    </main>
  )
}