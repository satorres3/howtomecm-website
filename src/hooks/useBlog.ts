import { useMemo } from 'react'
import { useApi, usePaginatedApi } from './useApi'
import {
  PostSchema,
  PostsResponseSchema,
  PostsQuerySchema,
  type Post,
  type PostsResponse,
  type PostsQuery,
} from '@/lib/schemas'

/**
 * Hook for fetching a single blog post by slug
 */
export function useBlogPost(slug: string | null) {
  const key = slug ? `/api/posts/${encodeURIComponent(slug)}` : null

  return useApi(key, PostSchema, {
    // Cache blog posts for longer since they don't change frequently
    dedupingInterval: 600000, // 10 minutes
    revalidateOnFocus: false,
    revalidateOnMount: true,
  })
}

/**
 * Hook for fetching paginated blog posts with filtering
 */
export function useBlogPosts(query: Partial<PostsQuery> = {}) {
  // Validate and set defaults for query parameters
  const validatedQuery = useMemo(() => {
    try {
      return PostsQuerySchema.parse(query)
    } catch (error) {
      console.warn('Invalid blog posts query parameters:', error)
      return PostsQuerySchema.parse({}) // Use defaults
    }
  }, [query])

  // Build query string
  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    Object.entries(validatedQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    return params.toString()
  }, [validatedQuery])

  const key = `/api/posts?${queryString}`

  const result = usePaginatedApi(key, PostsResponseSchema, {
    dedupingInterval: 300000, // 5 minutes for post lists
    revalidateOnFocus: false,
  })

  return {
    ...result,
    posts: result.data?.data || [],
    total: result.data?.total || 0,
    hasMore: result.data?.has_more || false,
    currentPage: validatedQuery.page,
    totalPages: result.data?.total ? Math.ceil(result.data.total / validatedQuery.limit) : 0,
  }
}

/**
 * Hook for fetching featured/recent posts for homepage
 */
export function useFeaturedPosts(limit = 6) {
  const query: PostsQuery = {
    limit,
    page: 1,
    published: true,
    sort: 'created_at',
    order: 'desc',
  }

  return useBlogPosts(query)
}

/**
 * Hook for fetching posts by category
 */
export function usePostsByCategory(categorySlug: string, limit = 10) {
  const query: PostsQuery = {
    category: categorySlug,
    limit,
    page: 1,
    published: true,
    sort: 'created_at',
    order: 'desc',
  }

  return useBlogPosts(query)
}

/**
 * Hook for search functionality
 */
export function usePostSearch(searchTerm: string, options: Partial<PostsQuery> = {}) {
  const query: PostsQuery = {
    search: searchTerm,
    limit: 20,
    page: 1,
    published: true,
    sort: 'created_at',
    order: 'desc',
    ...options,
  }

  // Only fetch if search term is provided and has minimum length
  const shouldFetch = searchTerm.trim().length >= 2

  const result = useBlogPosts(shouldFetch ? query : {})

  return {
    ...result,
    isSearching: shouldFetch,
    searchTerm: searchTerm.trim(),
  }
}

/**
 * Hook for related posts based on category and tags
 */
export function useRelatedPosts(currentPost: Post | null, limit = 4) {
  const categoryQuery: PostsQuery | null = currentPost?.category
    ? {
        category: currentPost.category.slug,
        limit: limit * 2, // Fetch more to filter out current post
        page: 1,
        published: true,
        sort: 'created_at',
        order: 'desc',
      }
    : null

  const result = useBlogPosts(categoryQuery || {})

  // Filter out the current post and limit results
  const relatedPosts = useMemo(() => {
    if (!result.posts || !currentPost) return []

    return result.posts.filter(post => post.id !== currentPost.id).slice(0, limit)
  }, [result.posts, currentPost, limit])

  return {
    ...result,
    posts: relatedPosts,
    isEmpty: relatedPosts.length === 0,
  }
}

/**
 * Hook for prefetching blog post data
 */
export function usePrefetchBlogPost() {
  const prefetch = (slug: string) => {
    // Note: In a real implementation, this would use SWR's preload functionality
    // For now, we'll just return the slug for type safety
    return slug
  }

  return { prefetch }
}
