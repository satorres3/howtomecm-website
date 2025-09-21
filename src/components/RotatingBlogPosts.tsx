'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SamplePost } from '../data/samplePosts'

interface RotatingBlogPostsProps {
  posts: SamplePost[]
  autoRotate?: boolean
  rotationInterval?: number
  showThumbnails?: boolean
  className?: string
}

export default function RotatingBlogPosts({
  posts,
  autoRotate = true,
  rotationInterval = 5000,
  showThumbnails = true,
  className = ''
}: RotatingBlogPostsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isHovered || posts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, isHovered, posts.length, rotationInterval])

  const currentPost = posts[currentIndex]

  if (!currentPost || posts.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
        <p className="text-gray-500">No posts available</p>
      </div>
    )
  }

  const handlePostSelect = (index: number) => {
    setCurrentIndex(index)
  }

  const nextPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length)
  }

  const prevPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length)
  }

  // Generate background image based on category
  const getBackgroundImage = (category: string) => {
    const categoryImages = {
      'MECM': 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1200&h=800&fit=crop&crop=center',
      'Azure': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop&crop=center',
      'PowerShell': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop&crop=center',
      'Intune': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop&crop=center'
    }
    return categoryImages[category as keyof typeof categoryImages] ||
           'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&h=800&fit=crop&crop=center'
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentPost.featured_image || getBackgroundImage(currentPost.category.name)}
          alt={currentPost.title}
          fill
          className="object-cover transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-blue-800/80"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 md:p-12 min-h-[500px] flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                Featured Post
              </span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex space-x-2">
              <button
                onClick={prevPost}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                aria-label="Previous post"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextPost}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                aria-label="Next post"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide font-medium backdrop-blur-sm">
              {currentPost.category.name}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {currentPost.title}
          </h2>

          {/* Excerpt */}
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl line-clamp-3">
            {currentPost.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-6 sm:space-y-0 mt-8">
          {/* Post Meta */}
          <div className="flex items-center space-x-6 text-sm text-blue-200">
            <span>{new Date(currentPost.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>By {currentPost.author.full_name}</span>
          </div>

          {/* CTA Button */}
          <Link
            href={`/blog/${currentPost.slug}`}
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 hover:scale-105 group"
          >
            Read Full Article
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Thumbnails/Indicators */}
      {showThumbnails && posts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2 bg-black/20 p-2 rounded-full backdrop-blur-sm">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePostSelect(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to post ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {autoRotate && !isHovered && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div
            className="h-full bg-white/80 transition-all duration-100"
            style={{
              width: `${((Date.now() % rotationInterval) / rotationInterval) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  )
}