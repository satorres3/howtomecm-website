import { Metadata } from 'next'
import { ContentLibrary } from '../../lib/content'
import RotatingBlogPosts from '../components/RotatingBlogPosts'
import ModernBlogCard from '../components/ModernBlogCard'
import DarkModeToggle from '../components/DarkModeToggle'
import type { Post } from '../../types/content'
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

export default async function HomePage() {
  // Try to get recent posts from CMS
  const recentPostsResult = await ContentLibrary.getRecentPosts(DOMAIN, 6)
  const recentPosts = recentPostsResult.success ? recentPostsResult.data || [] : []

  // Use CMS posts if available, otherwise fall back to sample posts
  const allPosts = recentPosts.length > 0 ? recentPosts : samplePosts
  const featuredPosts = (allPosts.slice(0, 4) as any)
  const latestPosts = (allPosts.slice(0, 6) as any)

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Clean Header with Social Links */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                How to MeCM
              </h1>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  Blog
                </a>
                <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  About
                </a>
                <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                  Contact
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* YouTube Link */}
              <a
                href="https://youtube.com/@howtomecm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="hidden sm:inline">YouTube</span>
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://linkedin.com/in/sauloalvestorres"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-[#0077B5] hover:bg-[#005885] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="hidden sm:inline">LinkedIn</span>
              </a>

              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Blog Focus */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Microsoft Technology
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Expert insights on MECM, Azure, and enterprise solutions.
              Practical guides and best practices for IT professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/blog"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Explore Blog Posts
              </a>
              <a
                href="https://youtube.com/@howtomecm"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Posts
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Latest insights and tutorials from our tech blog
              </p>
            </div>

            {/* Rotating Featured Posts */}
            <div className="mb-16">
              <RotatingBlogPosts
                posts={featuredPosts}
                autoRotate={true}
                rotationInterval={7000}
                showThumbnails={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Latest Posts
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay updated with our latest content
                </p>
              </div>
              <a
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center group"
              >
                View All Posts
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="grid gap-8">
              {/* First post as featured */}
              {latestPosts[0] && (
                <div className="animate-fade-in">
                  <ModernBlogCard
                    post={latestPosts[0]}
                    variant="featured"
                    showAuthor={true}
                    showExcerpt={true}
                  />
                </div>
              )}

              {/* Remaining posts in grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestPosts.slice(1).map((post: any, index: number) => (
                  <div key={post.id} className="animate-fade-in" style={{animationDelay: `${(index + 1) * 100}ms`}}>
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
          </div>
        </div>
      </section>

      {/* Newsletter/Contact CTA */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Stay Connected
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Follow our journey for the latest Microsoft technology insights and tutorials
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://youtube.com/@howtomecm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe on YouTube
              </a>
              <a
                href="https://linkedin.com/in/sauloalvestorres"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
