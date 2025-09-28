import { cache } from 'react'
import 'server-only'
import { Post, PostsResponse, PostsQuery } from './schemas'
import { sanitizeUrl } from './sanitize'

// Base API URL - in a real app this would come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

/**
 * Cached function to fetch a single blog post by slug
 * This will only execute once per request for the same slug
 */
export const getCachedPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const url = `${API_BASE_URL}/posts/${encodeURIComponent(slug)}`
    const sanitizedUrl = sanitizeUrl(url)

    if (!sanitizedUrl) {
      throw new Error('Invalid URL for post fetch')
    }

    const response = await fetch(sanitizedUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Use Next.js caching for server-side requests
      cache: 'force-cache',
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: [`post-${slug}`, 'posts'], // Tags for selective revalidation
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch post: ${response.status}`)
    }

    const data = await response.json()
    return data as Post
  } catch (error) {
    console.error('Error fetching cached post:', error)
    return null
  }
})

/**
 * Cached function to fetch blog posts with query parameters
 * Memoizes results based on the stringified query parameters
 */
export const getCachedPosts = cache(
  async (query: Partial<PostsQuery> = {}): Promise<PostsResponse> => {
    try {
      // Build query string from parameters
      const searchParams = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })

      const url = `${API_BASE_URL}/posts?${searchParams.toString()}`
      const sanitizedUrl = sanitizeUrl(url)

      if (!sanitizedUrl) {
        throw new Error('Invalid URL for posts fetch')
      }

      const response = await fetch(sanitizedUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
        next: {
          revalidate: 1800, // Revalidate every 30 minutes for lists
          tags: ['posts', `posts-page-${query.page || 1}`],
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`)
      }

      const data = await response.json()
      return data as PostsResponse
    } catch (error) {
      console.error('Error fetching cached posts:', error)
      // Return empty response on error
      return {
        data: [],
        total: 0,
        page: query.page || 1,
        limit: query.limit || 10,
        has_more: false,
      }
    }
  }
)

/**
 * Cached function to fetch featured posts for homepage
 */
export const getCachedFeaturedPosts = cache(async (limit = 6): Promise<Post[]> => {
  const response = await getCachedPosts({
    limit,
    page: 1,
    published: true,
    sort: 'created_at',
    order: 'desc',
  })

  return response.data
})

/**
 * Cached function to fetch posts by category
 */
export const getCachedPostsByCategory = cache(
  async (categorySlug: string, limit = 10): Promise<Post[]> => {
    const response = await getCachedPosts({
      category: categorySlug,
      limit,
      page: 1,
      published: true,
      sort: 'created_at',
      order: 'desc',
    })

    return response.data
  }
)

/**
 * Cached function to fetch related posts based on current post
 */
export const getCachedRelatedPosts = cache(
  async (currentPost: Post, limit = 4): Promise<Post[]> => {
    if (!currentPost.category) {
      return []
    }

    const response = await getCachedPosts({
      category: currentPost.category.slug,
      limit: limit * 2, // Fetch more to filter out current post
      page: 1,
      published: true,
      sort: 'created_at',
      order: 'desc',
    })

    // Filter out the current post and limit results
    return response.data.filter(post => post.id !== currentPost.id).slice(0, limit)
  }
)

/**
 * Cached function for search functionality
 */
export const getCachedSearchResults = cache(
  async (searchTerm: string, options: Partial<PostsQuery> = {}): Promise<Post[]> => {
    if (searchTerm.trim().length < 2) {
      return []
    }

    const response = await getCachedPosts({
      search: searchTerm.trim(),
      limit: 20,
      page: 1,
      published: true,
      sort: 'created_at',
      order: 'desc',
      ...options,
    })

    return response.data
  }
)

/**
 * Preload function to warm the cache for a specific post
 * Call this function to prefetch data before navigation
 */
export const preloadPost = (slug: string) => {
  // This will warm the cache without waiting for the result
  void getCachedPost(slug)
}

/**
 * Preload function to warm the cache for posts list
 */
export const preloadPosts = (query: Partial<PostsQuery> = {}) => {
  // This will warm the cache without waiting for the result
  void getCachedPosts(query)
}
