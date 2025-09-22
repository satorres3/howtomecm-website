import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ContentLibrary } from '../../lib/content'
import RotatingBlogPosts from '../components/RotatingBlogPosts'
import ModernBlogCard from '../components/ModernBlogCard'
import DynamicHero from '../components/DynamicHero'
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

  // Transform posts to compatible format for DynamicHero component
  const heroCompatiblePosts = allPosts
    .filter(post => post.excerpt) // Only posts with excerpts
    .map(post => ({
      ...post,
      excerpt: post.excerpt || '', // Ensure excerpt is always string
      author: post.author || { full_name: 'Portal Blog Team', email: 'admin@howtomecm.com' },
      category: post.category || { name: 'Technology', slug: 'technology' },
      tags: post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name) || ['Microsoft', 'Technology']
    }))

  const featuredPosts = (allPosts.slice(0, 4) as any)
  const latestPosts = (allPosts.slice(0, 6) as any)

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-16 relative">
      {/* Ambient Gradient Wave Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-blue-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Welcome Section */}
      <section className="relative py-20 text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent">
                The Official Portal Blog
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Your gateway to expert insights, comprehensive tutorials, and professional consulting on Microsoft technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Hero Section */}
      <DynamicHero posts={heroCompatiblePosts} className="relative" />

      {/* Premium Promotional Cards */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">

              {/* YouTube Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-8 text-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
                {/* Radial glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">YouTube Channel</h3>
                      <p className="text-red-100">Video tutorials & demos</p>
                    </div>
                  </div>

                  <p className="text-red-100 mb-6 leading-relaxed">
                    Watch comprehensive video tutorials, live demonstrations, and step-by-step implementation guides for Microsoft technologies.
                  </p>

                  <div className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                    <span className="font-semibold mr-2">Subscribe & Watch</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <a
                  href="https://youtube.com/@howtomecm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label="Visit YouTube Channel"
                ></a>
              </div>

              {/* LinkedIn Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0077B5] via-[#005885] to-[#004e70] p-8 text-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
                {/* Radial glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">LinkedIn Network</h3>
                      <p className="text-blue-100">Professional insights</p>
                    </div>
                  </div>

                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Connect with industry professionals, get exclusive insights, and stay updated with the latest Microsoft technology trends.
                  </p>

                  <div className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                    <span className="font-semibold mr-2">Connect & Follow</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <a
                  href="https://linkedin.com/in/sauloalvestorres"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label="Connect on LinkedIn"
                ></a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Video
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Watch our latest tutorial on Microsoft Configuration Manager
            </p>
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Microsoft MECM Tutorial</h3>
                  <p className="text-white/80">Complete deployment guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Articles Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                More Articles
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Explore our comprehensive library of Microsoft technology guides
              </p>
            </div>

            {/* Clean three-column grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestPosts.slice(0, 6).map((post: any, index: number) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:scale-105">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featured_image || `https://images.unsplash.com/photo-${['1517180102446-f3ece451e9d8', '1573496359142-b8b25c0c5ee7', '1498050108023-c5e6f2bdc15b'][index % 3]}?w=400&h=300&fit=crop`}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                          {post.category?.name || 'Article'}
                        </span>
                        <span>•</span>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString()}
                        </time>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {post.author.full_name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {post.author.full_name}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">1</button>
              <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">2</button>
              <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">3</button>
              <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <a
                href="https://youtube.com/@howtomecm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href="https://linkedin.com/in/sauloalvestorres"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#0077B5] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 How to MeCM. All rights reserved. | Expert Microsoft Technology Consulting & Insights
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
