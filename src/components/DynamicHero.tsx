'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SamplePost } from '../data/samplePosts'

interface DynamicHeroProps {
  posts: SamplePost[]
  className?: string
}

// Shuffle array function for randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function DynamicHero({ posts, className = '' }: DynamicHeroProps) {
  const [randomizedPosts, setRandomizedPosts] = useState<SamplePost[]>([])

  // Randomize posts on component mount
  useEffect(() => {
    if (posts && posts.length > 0) {
      const shuffled = shuffleArray(posts)
      setRandomizedPosts(shuffled.slice(0, 3)) // Take first 3 for hero
    }
  }, [posts])

  if (!randomizedPosts || randomizedPosts.length === 0) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Loading featured content...</p>
          </div>
        </div>
      </section>
    )
  }

  const featuredPost = randomizedPosts[0]
  const sidebarPosts = randomizedPosts.slice(1, 3)

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Large Featured Article Card - Left Side */}
            <div className="lg:col-span-2">
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <article className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-[500px] transform hover:scale-[1.02]">
                  {/* Featured Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={featuredPost.featured_image || 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop'}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-900">
                        {featuredPost.category?.name || 'Article'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <time dateTime={featuredPost.date}>
                        {new Date(featuredPost.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span>•</span>
                      <span>{Math.ceil(Math.random() * 8 + 4)} min read</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-3">
                      {featuredPost.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed line-clamp-3 mb-6">
                      {featuredPost.excerpt}
                    </p>

                    {/* Author */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {featuredPost.author.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {featuredPost.author.full_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Microsoft Technology Expert
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Sidebar Articles - Right Side */}
            <div className="lg:col-span-1 space-y-6">
              {sidebarPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.05] h-[235px]">
                    {/* Image */}
                    <div className="relative h-24 overflow-hidden">
                      <Image
                        src={post.featured_image || `https://images.unsplash.com/photo-${['1573496359142-b8b25c0c5ee7', '1498050108023-c5e6f2bdc15b'][index % 2]}?w=400&h=200&fit=crop`}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString()}
                        </time>
                        <span>•</span>
                        <span>{Math.ceil(Math.random() * 6 + 3)} min</span>
                      </div>

                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}