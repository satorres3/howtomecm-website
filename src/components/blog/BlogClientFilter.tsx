'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Post } from '../../../types/content'
import BlogCard from './BlogCard'

interface BlogClientFilterProps {
  posts: Post[]
  categories: Array<{
    id: string
    name: string
    slug: string
    icon?: string
    description?: string
  }>
}

export default function BlogClientFilter({ posts, categories }: BlogClientFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [activeTagSlug, setActiveTagSlug] = useState<string | null>(null)

  // Update state from URL parameters on mount and when searchParams change
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const tagParam = searchParams.get('tag')

    setActiveCategorySlug(categoryParam)
    setActiveTagSlug(tagParam)
  }, [searchParams])

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    if (activeCategorySlug) {
      filtered = filtered.filter(post => {
        const slug = (post as any).category_slug || post.category?.slug
        return slug === activeCategorySlug
      })
    }

    if (activeTagSlug) {
      filtered = filtered.filter(post => {
        if (!post.tags || !Array.isArray(post.tags)) return false
        return post.tags.some((tag: any) => tag.slug === activeTagSlug)
      })
    }

    return filtered
  }, [posts, activeCategorySlug, activeTagSlug])

  // Update URL when filters change
  const updateFilter = (type: 'category' | 'tag', value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }

    // Clear other filters when setting a new one for simplicity
    if (type === 'category') {
      params.delete('tag')
      setActiveTagSlug(null)
    } else if (type === 'tag') {
      params.delete('category')
      setActiveCategorySlug(null)
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="container-modern space-y-16">
      {/* Category filter navigation */}
      {categories.length > 0 && (
        <nav aria-label="Filter posts by category" className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => updateFilter('category', null)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 sm:text-sm ${
              !activeCategorySlug
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-200'
                : 'border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            All field notes
          </button>
          {categories.map(category => (
            <button
              key={category.slug ?? category.id}
              onClick={() => updateFilter('category', category.slug)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 sm:text-sm ${
                activeCategorySlug === category.slug
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-500/20 dark:text-blue-200'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <span aria-hidden="true">{category.icon ?? '📘'}</span>
              {category.name}
            </button>
          ))}
        </nav>
      )}

      {/* Posts section */}
      <section id="latest" data-testid="blog-posts" className="space-y-10">
        <header className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {activeCategorySlug
              ? `${categories.find(c => c.slug === activeCategorySlug)?.name || 'Filtered'} Articles`
              : 'Featured articles'
            }
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300 sm:text-base">
            {activeCategorySlug
              ? `${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} in ${categories.find(c => c.slug === activeCategorySlug)?.name || 'this category'}`
              : 'Curated guidance, migration notes, and operational checklists for enterprise endpoint teams.'
            }
          </p>
        </header>

        {filteredPosts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-12">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {activeCategorySlug ? 'No posts in this category' : 'No posts published yet'}
            </h3>
            <p className="mt-4 text-base">
              {activeCategorySlug
                ? 'Try browsing other categories or check back later for new content.'
                : 'We&apos;re curating fresh field notes right now. Subscribe to the newsletter or check back soon for the next deep dive.'
              }
            </p>
            {activeCategorySlug ? (
              <button
                onClick={() => updateFilter('category', null)}
                className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 dark:bg-white dark:text-gray-900"
              >
                Show all posts
              </button>
            ) : (
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 dark:bg-white dark:text-gray-900"
              >
                Get notified when we publish
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}