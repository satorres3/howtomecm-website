import { query, queryOne, select, selectOne, insert, withDatabaseErrorHandling } from './database'
import type { Page, Post, ContentSection, SEOData, MediaFile } from '../../types/content'
import type { CompleteHomepageContent } from '../../types/homepage'

// CMS API Configuration
const CMS_API_URL = process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_URL
const ENABLE_CMS_INTEGRATION = process.env.ENABLE_CMS_INTEGRATION === 'true' || process.env.NEXT_PUBLIC_ENABLE_CMS_INTEGRATION === 'true'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const contentCache = new Map<string, { data: any; timestamp: number }>()

// Cache utilities
function getCacheKey(operation: string, params: Record<string, any>): string {
  return `${operation}:${JSON.stringify(params)}`
}

function getFromCache<T>(key: string): T | null {
  const cached = contentCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCache<T>(key: string, data: T): void {
  contentCache.set(key, { data, timestamp: Date.now() })
}

// Import database result type from our database module
import type { DatabaseResult } from './database'

// Type alias for consistency with existing code
type ContentResult<T> = DatabaseResult<T>

function createSuccessResult<T>(data: T): ContentResult<T> {
  return { data, error: null, success: true }
}

function createErrorResult<T>(error: string): ContentResult<T> {
  // Only log errors in development to avoid spam in production
  if (process.env.NODE_ENV === 'development') {
    console.debug('Content fetch error:', error)
  }
  return { data: null, error, success: false }
}

/**
 * Enhanced content fetching library with caching and error handling
 * Supports both direct Supabase access and CMS API integration
 */
export class ContentLibrary {
  /**
   * Get media files from CMS
   */
  static async getMediaFiles(domain: string): Promise<ContentResult<MediaFile[]>> {
    const cacheKey = getCacheKey('media', { domain })
    const cached = getFromCache<MediaFile[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await select<MediaFile>('media_files', '*', { domain })

      if (!result.success) {
        return createErrorResult(`Failed to fetch media files: ${result.error}`)
      }

      const mediaFiles = result.data || []
      setCache(cacheKey, mediaFiles)
      return createSuccessResult(mediaFiles)
    })
  }

  /**
   * Get categories for a domain
   */
  static async getCategories(domain: string): Promise<ContentResult<any[]>> {
    const cacheKey = getCacheKey('categories', { domain })
    const cached = getFromCache<any[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await select(
        'categories',
        '*',
        { website_domain: domain, is_active: true },
        'sort_order ASC'
      )

      if (!result.success) {
        return createErrorResult(`Failed to fetch categories: ${result.error}`)
      }

      const categories = result.data || []
      setCache(cacheKey, categories)
      return createSuccessResult(categories)
    })
  }

  /**
   * Get tags for a domain
   */
  static async getTags(domain: string): Promise<ContentResult<any[]>> {
    const cacheKey = getCacheKey('tags', { domain })
    const cached = getFromCache<any[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await select('tags', '*', {})

      if (!result.success) {
        return createErrorResult(`Failed to fetch tags: ${result.error}`)
      }

      const tags = result.data || []
      setCache(cacheKey, tags)
      return createSuccessResult(tags)
    })
  }

  /**
   * Get comments for a post
   */
  static async getComments(postId: string): Promise<ContentResult<any[]>> {
    const cacheKey = getCacheKey('comments', { postId })
    const cached = getFromCache<any[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await select(
        'comments',
        '*',
        { post_id: postId, status: 'approved' },
        'created_at ASC'
      )

      if (!result.success) {
        return createErrorResult(`Failed to fetch comments: ${result.error}`)
      }

      const comments = result.data || []
      setCache(cacheKey, comments)
      return createSuccessResult(comments)
    })
  }

  /**
   * Get forms for a domain
   */
  static async getForms(domain: string): Promise<ContentResult<any[]>> {
    const cacheKey = getCacheKey('forms', { domain })
    const cached = getFromCache<any[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await select('forms', '*', { domain })

      if (!result.success) {
        return createErrorResult(`Failed to fetch forms: ${result.error}`)
      }

      const forms = result.data || []
      setCache(cacheKey, forms)
      return createSuccessResult(forms)
    })
  }

  /**
   * Create a new form submission
   */
  static async submitForm(formId: string, formData: Record<string, any>): Promise<ContentResult<any>> {
    return withDatabaseErrorHandling(async () => {
      const result = await insert('form_submissions', {
        form_id: formId,
        data: formData,
        submitted_at: new Date().toISOString(),
        ip_address: '', // Will be filled by edge function
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      })

      if (!result.success) {
        return createErrorResult(`Failed to submit form: ${result.error}`)
      }

      return createSuccessResult(result.data)
    })
  }

  /**
   * CMS API Integration Methods
   */
  static async createContentViaCMS(type: 'post' | 'page', data: any): Promise<ContentResult<any>> {
    if (!ENABLE_CMS_INTEGRATION || !CMS_API_URL) {
      return createErrorResult('CMS integration not enabled')
    }

    try {
      const response = await fetch(`${CMS_API_URL}/${type}s`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        return createErrorResult(`Failed to create ${type}: ${response.statusText}`)
      }

      const result = await response.json()

      // Clear cache to ensure fresh data
      ContentLibrary.clearCache(data.website_domain)

      return createSuccessResult(result)
    } catch (error) {
      return createErrorResult(`Unexpected error creating ${type}: ${error}`)
    }
  }

  /**
   * Upload media via CMS
   */
  static async uploadMediaViaCMS(file: File, domain: string): Promise<ContentResult<any>> {
    if (!ENABLE_CMS_INTEGRATION || !CMS_API_URL) {
      return createErrorResult('CMS integration not enabled')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('domain', domain)

      const response = await fetch(`${CMS_API_URL}/media`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        return createErrorResult(`Failed to upload media: ${response.statusText}`)
      }

      const result = await response.json()

      // Clear media cache
      const cacheKey = getCacheKey('media', { domain })
      contentCache.delete(cacheKey)

      return createSuccessResult(result)
    } catch (error) {
      return createErrorResult(`Unexpected error uploading media: ${error}`)
    }
  }
  /**
   * Get all pages for a domain with caching
   */
  static async getAllPages(domain: string): Promise<ContentResult<Page[]>> {
    const cacheKey = getCacheKey('pages', { domain })
    const cached = getFromCache<Page[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await select<Page>(
        'pages',
        '*',
        {
          website_domain: domain,
          status: 'published',
          is_published_to_domain: true
        },
        'created_at DESC'
      )

      if (!result.success) {
        return createErrorResult(`Failed to fetch pages: ${result.error}`)
      }

      const pages = result.data || []
      setCache(cacheKey, pages)
      return createSuccessResult(pages)
    })
  }

  /**
   * Get all posts for a domain with caching
   */
  static async getAllPosts(domain: string): Promise<ContentResult<Post[]>> {
    const cacheKey = getCacheKey('posts', { domain })
    const cached = getFromCache<Post[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      // Complex query with joins - using raw SQL for better control
      const result = await query<Post>(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          COALESCE(pm.view_count, 0) as view_count,
          COALESCE(pm.share_count, 0) as share_count,
          COALESCE(pm.like_count, 0) as like_count,
          COALESCE(
            json_agg(
              json_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
              )
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          ) as tags
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN post_metrics pm ON pm.post_id = p.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.website_domain = $1
        AND p.status = 'published'
        AND p.is_published_to_domain = true
        GROUP BY p.id, c.id, pm.view_count, pm.share_count, pm.like_count
        ORDER BY p.created_at DESC
      `, [domain])

      if (!result.success) {
        return createErrorResult(`Failed to fetch posts: ${result.error}`)
      }

      const posts = result.data || []
      setCache(cacheKey, posts)
      return createSuccessResult(posts)
    })
  }

  /**
   * Get a page by slug with caching
   */
  static async getPageBySlug(domain: string, slug: string): Promise<ContentResult<Page>> {
    const cacheKey = getCacheKey('page', { domain, slug })
    const cached = getFromCache<Page>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      let result: DatabaseResult<Page>

      // Special handling for 'home' slug - look for homepage
      if (slug === 'home') {
        result = await selectOne<Page>('pages', '*', {
          website_domain: domain,
          is_homepage: true,
          status: 'published',
          is_published_to_domain: true
        })

        if (!result.success) {
          return createErrorResult('Homepage not found')
        }
      } else {
        // Regular slug lookup
        result = await selectOne<Page>('pages', '*', {
          website_domain: domain,
          slug: slug,
          status: 'published',
          is_published_to_domain: true
        })

        if (!result.success) {
          return createErrorResult('Page not found')
        }
      }

      setCache(cacheKey, result.data!)
      return createSuccessResult(result.data!)
    })
  }

  /**
   * Get a post by slug with caching
   */
  static async getPostBySlug(domain: string, slug: string): Promise<ContentResult<Post>> {
    const cacheKey = getCacheKey('post', { domain, slug })
    const cached = getFromCache<Post>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await query<Post>(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          COALESCE(pm.view_count, 0) as view_count,
          COALESCE(pm.share_count, 0) as share_count,
          COALESCE(pm.like_count, 0) as like_count,
          COALESCE(
            json_agg(
              json_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
              )
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          ) as tags
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN post_metrics pm ON pm.post_id = p.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.website_domain = $1
        AND p.slug = $2
        AND p.status = 'published'
        AND p.is_published_to_domain = true
        GROUP BY p.id, c.id, pm.view_count, pm.share_count, pm.like_count
        LIMIT 1
      `, [domain, slug])

      if (!result.success || !result.data || result.data.length === 0) {
        return createErrorResult('Post not found')
      }

      const post = result.data[0]
      setCache(cacheKey, post)
      return createSuccessResult(post)
    })
  }

  /**
   * Get posts by category
   */
  static async getPostsByCategory(domain: string, categorySlug: string): Promise<ContentResult<Post[]>> {
    const cacheKey = getCacheKey('posts-category', { domain, categorySlug })
    const cached = getFromCache<Post[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await query<Post>(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          COALESCE(pm.view_count, 0) as view_count,
          COALESCE(pm.share_count, 0) as share_count,
          COALESCE(pm.like_count, 0) as like_count,
          up.full_name as author_name,
          up.avatar_url as author_avatar,
          COALESCE(
            json_agg(
              json_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
              )
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          ) as tags
        FROM posts p
        INNER JOIN categories c ON p.category_id = c.id
        LEFT JOIN user_profiles up ON p.author_id = up.id
        LEFT JOIN post_metrics pm ON pm.post_id = p.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.website_domain = $1
        AND p.status = 'published'
        AND p.is_published_to_domain = true
        AND c.slug = $2
        GROUP BY p.id, c.id, up.id, pm.view_count, pm.share_count, pm.like_count
        ORDER BY p.created_at DESC
      `, [domain, categorySlug])

      if (!result.success) {
        return createErrorResult(`Failed to fetch posts by category: ${result.error}`)
      }

      const posts = result.data || []
      setCache(cacheKey, posts)
      return createSuccessResult(posts)
    })
  }

  /**
   * Get posts by tag
   */
  static async getPostsByTag(domain: string, tagSlug: string): Promise<ContentResult<Post[]>> {
    const cacheKey = getCacheKey('posts-tag', { domain, tagSlug })
    const cached = getFromCache<Post[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await query<Post>(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          COALESCE(pm.view_count, 0) as view_count,
          COALESCE(pm.share_count, 0) as share_count,
          COALESCE(pm.like_count, 0) as like_count,
          COALESCE(
            json_agg(
              json_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
              )
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          ) as tags
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN post_metrics pm ON pm.post_id = p.id
        INNER JOIN post_tags pt ON p.id = pt.post_id
        INNER JOIN tags t ON pt.tag_id = t.id
        WHERE p.website_domain = $1
        AND p.status = 'published'
        AND p.is_published_to_domain = true
        AND t.slug = $2
        GROUP BY p.id, c.id, pm.view_count, pm.share_count, pm.like_count
        ORDER BY p.created_at DESC
      `, [domain, tagSlug])

      if (!result.success) {
        return createErrorResult(`Failed to fetch posts by tag: ${result.error}`)
      }

      const posts = result.data || []
      setCache(cacheKey, posts)
      return createSuccessResult(posts)
    })
  }

  /**
   * Get recent posts (limited number)
   */
  static async getRecentPosts(domain: string, limit: number = 5): Promise<ContentResult<Post[]>> {
    const cacheKey = getCacheKey('recent-posts', { domain, limit })
    const cached = getFromCache<Post[]>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      // Try to fetch from CMS API if available
      if (CMS_API_URL && ENABLE_CMS_INTEGRATION) {
        const response = await fetch(`${CMS_API_URL}/api/posts?limit=${limit}`)
        if (response.ok) {
          const posts = await response.json()
          setCache(cacheKey, posts)
          return createSuccessResult(posts)
        }
      }

      // Get from posts table directly
      const result = await query<Post>(`
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          COALESCE(pm.view_count, 0) as view_count,
          COALESCE(pm.share_count, 0) as share_count,
          COALESCE(pm.like_count, 0) as like_count,
          COALESCE(
            json_agg(
              json_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
              )
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          ) as tags
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN post_metrics pm ON pm.post_id = p.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.website_domain = $1
        AND p.status = 'published'
        AND p.is_published_to_domain = true
        GROUP BY p.id, c.id, pm.view_count, pm.share_count, pm.like_count
        ORDER BY p.created_at DESC
        LIMIT $2
      `, [domain, limit])

      if (!result.success) {
        return createErrorResult(`Failed to fetch recent posts: ${result.error}`)
      }

      const posts = result.data || []
      setCache(cacheKey, posts)
      return createSuccessResult(posts)
    })
  }

  /**
   * Get site settings for a domain
   */
  static async getSiteSettings(domain: string): Promise<ContentResult<any>> {
    const cacheKey = getCacheKey('settings', { domain })
    const cached = getFromCache<any>(cacheKey)

    if (cached) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      const result = await selectOne('sites', '*', { domain })

      if (!result.success) {
        // Return default settings if none exist
        const defaultSettings = {
          domain,
          site_name: domain === 'staging.howtomecm.com' ? 'How to MeCM (Staging)' : 'How to MeCM',
          tagline: 'Microsoft endpoint knowledge hub',
          description: 'Hands-on guides, automation playbooks, and deployment retrospectives.'
        }
        setCache(cacheKey, defaultSettings)
        return createSuccessResult(defaultSettings)
      }

      setCache(cacheKey, result.data!)
      return createSuccessResult(result.data!)
    })
  }

  /**
   * Search content across posts and pages
   */
  static async searchContent(domain: string, searchQuery: string): Promise<ContentResult<(Post | Page)[]>> {
    if (!searchQuery.trim()) {
      return createSuccessResult([])
    }

    return withDatabaseErrorHandling(async () => {
      // Search posts with category and tag information
      const postsQuery = await query<Post>(`
        SELECT
          p.*,
          'post' as content_type,
          c.name as category_name,
          c.slug as category_slug,
          COALESCE(pm.view_count, 0) as view_count,
          COALESCE(pm.share_count, 0) as share_count,
          COALESCE(pm.like_count, 0) as like_count,
          COALESCE(
            json_agg(
              json_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
              )
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          ) as tags
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN post_metrics pm ON pm.post_id = p.id
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.website_domain = $1
        AND p.status = 'published'
        AND p.is_published_to_domain = true
        AND p.title ILIKE $2
        GROUP BY p.id, c.id, pm.view_count, pm.share_count, pm.like_count
        ORDER BY p.created_at DESC
      `, [domain, `%${searchQuery}%`])

      // Search pages
      const pagesQuery = await query<Page>(`
        SELECT
          *,
          'page' as content_type
        FROM pages
        WHERE website_domain = $1
        AND status = 'published'
        AND is_published_to_domain = true
        AND title ILIKE $2
        ORDER BY created_at DESC
      `, [domain, `%${searchQuery}%`])

      const postsResult = postsQuery
      const pagesResult = pagesQuery

      if (!postsResult.success || !pagesResult.success) {
        return createErrorResult(`Search failed: ${postsResult.error || pagesResult.error}`)
      }

      const results = [
        ...(postsResult.data || []),
        ...(pagesResult.data || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      return createSuccessResult(results)
    })
  }

  /**
   * Clear cache for a specific domain or all cache
   */
  static clearCache(domain?: string): void {
    if (domain) {
      // Clear cache entries for specific domain
      const keysToDelete: string[] = []
      contentCache.forEach((_, key) => {
        if (key.includes(domain)) {
          keysToDelete.push(key)
        }
      })
      keysToDelete.forEach(key => contentCache.delete(key))
    } else {
      // Clear all cache
      contentCache.clear()
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: contentCache.size,
      keys: Array.from(contentCache.keys())
    }
  }

  // ========================================
  // CMS HOMEPAGE CONTENT INTEGRATION
  // ========================================

  /**
   * Get published homepage content for a domain from CMS
   */
  static async getHomepageContent(domain: string, isPreview: boolean = false): Promise<ContentResult<CompleteHomepageContent>> {
    const cacheKey = getCacheKey('homepage-content', { domain, isPreview })
    const cached = getFromCache<CompleteHomepageContent>(cacheKey)

    if (cached && !isPreview) {
      return createSuccessResult(cached)
    }

    return withDatabaseErrorHandling(async () => {
      // Call the database function to get published content by domain
      const result = await query<{
        content: CompleteHomepageContent
        version_number: number
        modified_at: string
      }>('SELECT * FROM get_published_content_by_domain($1)', [domain])

      if (!result.success) {
        return createErrorResult(`Failed to fetch homepage content: ${result.error}`)
      }

      if (!result.data || result.data.length === 0) {
        return createErrorResult('No published homepage content found for this domain')
      }

      // Get the first (latest) result
      const contentRow = result.data[0]
      const homepageContent = contentRow.content as CompleteHomepageContent

      // Validate the content structure
      if (!homepageContent || typeof homepageContent !== 'object') {
        return createErrorResult('Invalid homepage content format')
      }

      // Cache the result (skip caching for preview requests)
      if (!isPreview) {
        setCache(cacheKey, homepageContent)
      }

      return createSuccessResult(homepageContent)
    })
  }

  /**
   * Get homepage content with preview token support
   */
  static async getHomepageContentWithPreview(
    domain: string,
    previewToken?: string
  ): Promise<ContentResult<CompleteHomepageContent>> {
    // If preview token is provided, always fetch fresh data
    if (previewToken) {
      return withDatabaseErrorHandling(async () => {
        // For preview mode, we get the latest content regardless of published status
        const result = await select<{
          content: CompleteHomepageContent
          version_number: number
          modified_at: string
        }>(
          'homepage_content',
          'content, version_number, modified_at',
          { environment_id: domain },
          'modified_at DESC',
          1
        )

        if (!result.success) {
          return createErrorResult(`Failed to fetch preview content: ${result.error}`)
        }

        if (!result.data || result.data.length === 0) {
          // Fallback to published content if no preview content
          return ContentLibrary.getHomepageContent(domain, false)
        }

        const contentRow = result.data[0]
        const homepageContent = contentRow.content as CompleteHomepageContent

        if (!homepageContent || typeof homepageContent !== 'object') {
          return createErrorResult('Invalid preview content format')
        }

        return createSuccessResult(homepageContent)
      })
    }

    // Regular published content request
    return ContentLibrary.getHomepageContent(domain, false)
  }

  /**
   * Get fallback homepage content structure when CMS content is unavailable
   */
  static getStaticHomepageContent(domain: string): CompleteHomepageContent {
    const baseUrl = `https://${domain}`

    return {
      id: 'static-fallback',
      environmentId: domain,
      header: {
        id: 'static-header',
        environmentId: domain,
        logo: {
          url: '/images/branding/portal-logo.svg',
          alt: 'How to MeCM Logo',
          width: 120,
          height: 40
        },
        brand: {
          name: 'How to MeCM',
          tagline: 'Microsoft endpoint learning hub',
          primaryColor: '#2563eb',
          secondaryColor: '#7c3aed'
        },
        navigation: {
          items: [
            { id: '1', label: 'Home', url: '/', target: '_self', order: 1, isActive: true },
            { id: '2', label: 'Blog', url: '/blog', target: '_self', order: 2, isActive: true },
            { id: '3', label: 'About', url: '/about', target: '_self', order: 3, isActive: true },
            { id: '4', label: 'Contact', url: '/contact', target: '_self', order: 4, isActive: true }
          ],
          searchPlaceholder: 'Search articles...'
        },
        socialLinks: {
          youtube: {
            url: 'https://youtube.com/@howtomecm',
            title: 'YouTube Channel',
            backgroundColor: '#dc2626'
          },
          linkedin: {
            url: 'https://linkedin.com/in/sauloalvestorres',
            title: 'LinkedIn Profile',
            backgroundColor: '#0077B5'
          }
        },
        lastModified: new Date().toISOString()
      },
      welcome: {
        id: 'static-welcome',
        mainHeading: 'The Official Portal Blog',
        subtitle: 'Your gateway to hands-on guides, lab notes, and deployment experiments for Microsoft endpoint ecosystems.',
        gradientColors: {
          from: '#2563eb',
          via: '#7c3aed',
          to: '#1e40af',
          darkFrom: '#3b82f6',
          darkVia: '#8b5cf6',
          darkTo: '#2563eb'
        },
        isActive: true
      },
      dynamicHero: {
        isActive: true,
        postsToShow: 4,
        showSidebar: false
      },
      promotionalCards: [
        {
          id: 'youtube-card',
          type: 'youtube',
          title: 'YouTube Channel',
          subtitle: 'Video tutorials & demos',
          description: 'Watch deep-dive tutorials, live demonstrations, and step-by-step implementation guides for Microsoft technologies.',
          url: 'https://youtube.com/@howtomecm',
          target: '_blank',
          gradientColors: {
            from: '#dc2626',
            via: '#ef4444',
            to: '#b91c1c'
          },
          icon: null,
          order: 1,
          isActive: true
        },
        {
          id: 'linkedin-card',
          type: 'linkedin',
          title: 'LinkedIn Network',
          subtitle: 'Community updates',
          description: 'Follow release breakdowns, roadmap reactions, and open discussions with the endpoint community.',
          url: 'https://linkedin.com/in/sauloalvestorres',
          target: '_blank',
          gradientColors: {
            from: '#0077B5',
            via: '#005885',
            to: '#004e70'
          },
          icon: null,
          order: 2,
          isActive: true
        }
      ],
      featuredVideo: {
        id: 'static-video',
        title: 'Featured Video',
        description: 'Watch our latest tutorial on Microsoft Configuration Manager',
        video: {
          title: 'Microsoft MECM Tutorial',
          description: 'Complete deployment guide',
          platform: null,
          autoplay: false,
          lazyLoad: true
        },
        styling: {
          aspectRatio: '16:9',
          backgroundColor: '#f3f4f6',
          gradientColors: {
            from: '#3b82f6',
            to: '#8b5cf6'
          },
          playButtonColor: '#ffffff',
          borderRadius: 12
        },
        isActive: true
      },
      articles: {
        id: 'static-articles',
        title: 'More Articles',
        description: 'Explore our comprehensive library of Microsoft technology guides',
        displaySettings: {
          postsPerPage: 6,
          showPagination: true,
          gridColumns: 3,
          showExcerpts: true,
          showAuthor: true,
          showDate: true,
          showCategory: true,
          showTags: false,
          showFeaturedImages: true,
          excerptMaxLines: 3,
          titleMaxLines: 2
        },
        layoutSettings: {
          cardBorderRadius: 12,
          shadowIntensity: 'light',
          hoverEffect: 'scale',
          imageAspectRatio: '16:9'
        },
        sortingSettings: {
          defaultSort: 'date-newest',
          enableCategoryFilter: false,
          enableSearch: false,
          loadMoreStyle: 'pagination'
        },
        paginationText: {
          next: 'Next',
          previous: 'Previous',
          page: 'Page',
          loadMore: 'Load More'
        },
        isActive: true
      },
      footer: {
        id: 'static-footer',
        environmentId: domain,
        copyrightText: '© 2024 How to MeCM. All rights reserved. | Microsoft endpoint knowledge & community.',
        showSocialLinks: true,
        socialLinks: [
          {
            id: 'youtube-footer',
            platform: 'YouTube',
            url: 'https://youtube.com/@howtomecm',
            isActive: true
          },
          {
            id: 'linkedin-footer',
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/sauloalvestorres',
            isActive: true
          }
        ],
        footerColumns: [],
        backgroundColor: '#ffffff',
        textColor: '#6b7280',
        lastModified: new Date().toISOString()
      },
      seo: {
        id: 'static-seo',
        environmentId: domain,
        pageTitle: 'How to MeCM – Microsoft endpoint knowledge hub',
        metaDescription: 'Deep technical guides, lab walkthroughs, and community automation for Microsoft Configuration Manager, Intune, and modern endpoint management teams.',
        keywords: ['Microsoft Configuration Manager', 'MECM', 'SCCM', 'Intune', 'Endpoint management', 'Automation', 'PowerShell', 'Windows Autopilot'],
        openGraph: {
          title: 'How to MeCM – Microsoft endpoint knowledge hub',
          description: 'Hands-on guides, videos, and automation blueprints for Microsoft endpoint teams.',
          image: '/og-image.jpg',
          url: baseUrl,
          siteName: 'How to MeCM',
          type: 'website',
          locale: 'en_US'
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How to MeCM – Microsoft endpoint knowledge hub',
          description: 'Hands-on guides, videos, and automation blueprints for Microsoft endpoint teams.',
          image: '/og-image.jpg'
        },
        structuredData: {
          organization: {
            name: 'How to MeCM',
            description: 'Microsoft endpoint learning community and technical resource library.',
            url: baseUrl,
            logo: `${baseUrl}/images/branding/portal-logo.svg`,
            sameAs: [
              'https://youtube.com/@howtomecm',
              'https://linkedin.com/in/sauloalvestorres'
            ]
          },
          contactPoint: {
            contactType: 'customer service',
            availableLanguage: 'English'
          }
        },
        robots: {
          index: true,
          follow: true,
          maxImagePreview: 'large',
          maxVideoPreview: -1,
          maxSnippet: -1
        },
        canonicalUrl: baseUrl,
        lastModified: new Date().toISOString()
      },
      background: {
        id: 'static-background',
        environmentId: domain,
        ambientGradient: {
          isActive: true,
          baseColors: {
            light: {
              primary: '#dbeafe',
              secondary: '#ede9fe',
              tertiary: '#fce7f3'
            },
            dark: {
              primary: '#1e3a8a',
              secondary: '#581c87',
              tertiary: '#831843'
            }
          },
          animatedBlobs: {
            isActive: true,
            blobs: [
              {
                id: 'blob-1',
                size: 384,
                position: { x: '25%', y: '0%' },
                colors: { from: '#60a5fa', to: '#8b5cf6' },
                animationDelay: '0s',
                blur: 48
              },
              {
                id: 'blob-2',
                size: 320,
                position: { x: '66%', y: '75%' },
                colors: { from: '#8b5cf6', to: '#ec4899' },
                animationDelay: '2s',
                blur: 32
              },
              {
                id: 'blob-3',
                size: 256,
                position: { x: '75%', y: '33%' },
                colors: { from: '#ec4899', to: '#3b82f6' },
                animationDelay: '4s',
                blur: 32
              }
            ]
          }
        },
        lastModified: new Date().toISOString()
      },
      lastModified: new Date().toISOString(),
      modifiedBy: 'system'
    }
  }

  /**
   * Get homepage content with intelligent fallback
   * This method provides a robust content fetching strategy
   */
  static async getHomepageContentWithFallback(
    domain: string,
    previewToken?: string
  ): Promise<ContentResult<CompleteHomepageContent>> {
    try {
      // First, try to get CMS content
      const cmsResult = await ContentLibrary.getHomepageContentWithPreview(domain, previewToken)

      if (cmsResult.success && cmsResult.data) {
        return cmsResult
      }

      // If CMS content fails, provide static fallback
      const staticContent = ContentLibrary.getStaticHomepageContent(domain)

      return createSuccessResult(staticContent)
    } catch (error) {
      // Final fallback - return static content even on unexpected errors
      const staticContent = ContentLibrary.getStaticHomepageContent(domain)
      return createSuccessResult(staticContent)
    }
  }

  /**
   * Clear homepage content cache
   */
  static clearHomepageCache(domain?: string): void {
    if (domain) {
      const keysToDelete: string[] = []
      contentCache.forEach((_, key) => {
        if (key.includes('homepage-content') && key.includes(domain)) {
          keysToDelete.push(key)
        }
      })
      keysToDelete.forEach(key => contentCache.delete(key))
    } else {
      // Clear all homepage cache
      const keysToDelete: string[] = []
      contentCache.forEach((_, key) => {
        if (key.includes('homepage-content')) {
          keysToDelete.push(key)
        }
      })
      keysToDelete.forEach(key => contentCache.delete(key))
    }
  }
}

// Enhanced exports - Full CMS functionality
export const getAllPages = ContentLibrary.getAllPages
export const getAllPosts = ContentLibrary.getAllPosts
export const getPageBySlug = ContentLibrary.getPageBySlug
export const getPostBySlug = ContentLibrary.getPostBySlug
export const getRecentPosts = ContentLibrary.getRecentPosts
export const getPostsByCategory = ContentLibrary.getPostsByCategory
export const getPostsByTag = ContentLibrary.getPostsByTag
export const getSiteSettings = ContentLibrary.getSiteSettings
export const searchContent = ContentLibrary.searchContent

// Media and Assets
export const getMediaFiles = ContentLibrary.getMediaFiles
export const uploadMediaViaCMS = ContentLibrary.uploadMediaViaCMS

// Taxonomy
export const getCategories = ContentLibrary.getCategories
export const getTags = ContentLibrary.getTags

// Interactive Features
export const getComments = ContentLibrary.getComments
export const getForms = ContentLibrary.getForms
export const submitForm = ContentLibrary.submitForm

// Content Creation (CMS Integration)
export const createContentViaCMS = ContentLibrary.createContentViaCMS

// Cache Management
export const clearContentCache = ContentLibrary.clearCache
export const getContentCacheStats = ContentLibrary.getCacheStats

// Homepage Content API (CMS Integration)
export const getHomepageContent = ContentLibrary.getHomepageContent
export const getHomepageContentWithPreview = ContentLibrary.getHomepageContentWithPreview
export const getHomepageContentWithFallback = ContentLibrary.getHomepageContentWithFallback
export const getStaticHomepageContent = ContentLibrary.getStaticHomepageContent
export const clearHomepageCache = ContentLibrary.clearHomepageCache
