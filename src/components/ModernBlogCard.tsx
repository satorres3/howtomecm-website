'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SamplePost } from '../data/samplePosts'
import type { Post } from '../../types/content'

interface ModernBlogCardProps {
  post: SamplePost | Post
  variant?: 'default' | 'featured' | 'compact' | 'minimal'
  imageUrl?: string
  showAuthor?: boolean
  showExcerpt?: boolean
  className?: string
}

export default function ModernBlogCard({
  post,
  variant = 'default',
  imageUrl,
  showAuthor = true,
  showExcerpt = true,
  className = ''
}: ModernBlogCardProps) {

  // Generate placeholder image URL based on category
  const getPlaceholderImage = (category: string) => {
    const categoryImages = {
      'MECM': 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&h=500&fit=crop&crop=center',
      'Azure': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&crop=center',
      'PowerShell': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&crop=center',
      'Intune': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop&crop=center'
    }
    return categoryImages[category as keyof typeof categoryImages] ||
           'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=500&fit=crop&crop=center'
  }

  const finalImageUrl = imageUrl || post.featured_image || getPlaceholderImage(post.category?.name || 'general')

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  // Category color mapping
  const getCategoryStyles = (categoryName: string) => {
    const categoryStyles = {
      'MECM': 'bg-blue-100 text-blue-800 border-blue-200',
      'Azure': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'PowerShell': 'bg-purple-100 text-purple-800 border-purple-200',
      'Intune': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return categoryStyles[categoryName as keyof typeof categoryStyles] ||
           'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className={`block group ${className}`}>
        <article className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          {/* Image */}
          <div className="relative h-80 md:h-96 overflow-hidden">
            <Image
              src={finalImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getCategoryStyles(post.category?.name || 'general')}`}>
                {post.category?.name || 'General'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight group-hover:text-blue-200 transition-colors duration-200">
              {post.title}
            </h2>

            {showExcerpt && (
              <p className="text-gray-200 mb-4 line-clamp-2 leading-relaxed">
                {post.excerpt || 'No excerpt available'}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                {showAuthor && (
                  <>
                    <span>•</span>
                    <span>{post.author?.full_name || 'Anonymous'}</span>
                  </>
                )}
                <span>•</span>
                <span>{calculateReadingTime(post.content || '')}</span>
              </div>

              <div className="flex items-center text-blue-300 group-hover:text-white transition-colors duration-200">
                <span className="text-sm font-medium mr-2">Read more</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className={`block group ${className}`}>
        <article className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="flex">
            {/* Image */}
            <div className="relative w-32 h-24 flex-shrink-0">
              <Image
                src={finalImageUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="128px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryStyles(post.category?.name || 'general')}`}>
                  {post.category?.name || 'General'}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                {post.title}
              </h3>

              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{calculateReadingTime(post.content || '')}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'minimal') {
    return (
      <Link href={`/blog/${post.slug}`} className={`block group ${className}`}>
        <article className="py-4 border-b border-gray-100 hover:border-gray-200 transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryStyles(post.category?.name || 'general')}`}>
              {post.category?.name || 'General'}
            </span>
            <span className="text-xs text-gray-500">{calculateReadingTime(post.content || '')}</span>
          </div>

          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
            {post.title}
          </h3>

          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            {showAuthor && (
              <>
                <span>•</span>
                <span>{post.author?.full_name || 'Anonymous'}</span>
              </>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/blog/${post.slug}`} className={`block group ${className}`}>
      <article className="card-modern overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-blog overflow-hidden">
          <Image
            src={finalImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryStyles(post.category?.name || 'general')}`}>
              {post.category?.name || 'General'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h3>

          {/* Excerpt */}
          {showExcerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              {showAuthor && (
                <>
                  <span>•</span>
                  <span>{post.author?.full_name || 'Anonymous'}</span>
                </>
              )}
            </div>
            <span>{calculateReadingTime(post.content || '')}</span>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  )
}