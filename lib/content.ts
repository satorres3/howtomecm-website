import { supabase } from './supabase'
import type { Page, Post, ContentSection, SEOData, MediaFile } from '../types/content'
import type { CompleteHomepageContent } from '../types/homepage'

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

// Error handling utilities
interface ContentResult<T> {
  data: T | null
  error: string | null
  success: boolean
}

function createSuccessResult<T>(data: T): ContentResult<T> {
  return { data, error: null, success: true }
}

function createErrorResult<T>(error: string): ContentResult<T> {
  console.error('Content fetch error:', error)
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

    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('domain', domain)
        .order('created_at', { ascending: false })

      if (error) {
        return createErrorResult(`Failed to fetch media files: ${error.message}`)
      }

      const mediaFiles = data || []
      setCache(cacheKey, mediaFiles)

      return createSuccessResult(mediaFiles)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching media files: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('website_domain', domain)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        return createErrorResult(`Failed to fetch categories: ${error.message}`)
      }

      const categories = data || []
      setCache(cacheKey, categories)

      return createSuccessResult(categories)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching categories: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        return createErrorResult(`Failed to fetch tags: ${error.message}`)
      }

      const tags = data || []
      setCache(cacheKey, tags)

      return createSuccessResult(tags)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching tags: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true })

      if (error) {
        return createErrorResult(`Failed to fetch comments: ${error.message}`)
      }

      const comments = data || []
      setCache(cacheKey, comments)

      return createSuccessResult(comments)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching comments: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('domain', domain)
        .order('created_at', { ascending: false })

      if (error) {
        return createErrorResult(`Failed to fetch forms: ${error.message}`)
      }

      const forms = data || []
      setCache(cacheKey, forms)

      return createSuccessResult(forms)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching forms: ${error}`)
    }
  }

  /**
   * Create a new form submission
   */
  static async submitForm(formId: string, formData: Record<string, any>): Promise<ContentResult<any>> {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          form_id: formId,
          data: formData,
          submitted_at: new Date().toISOString(),
          ip_address: '', // Will be filled by edge function
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        })
        .select()
        .single()

      if (error) {
        return createErrorResult(`Failed to submit form: ${error.message}`)
      }

      return createSuccessResult(data)
    } catch (error) {
      return createErrorResult(`Unexpected error submitting form: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('website_domain', domain)
        .eq('status', 'published')
        .eq('is_published_to_domain', true)
        .order('created_at', { ascending: false })

      if (error) {
        return createErrorResult(`Failed to fetch pages: ${error.message}`)
      }

      const pages = data || []
      setCache(cacheKey, pages)

      return createSuccessResult(pages)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching pages: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(*),
          post_tags(tags(*))
        `)
        .eq('website_domain', domain)
        .eq('status', 'published')
        .eq('is_published_to_domain', true)
        .order('created_at', { ascending: false })

      if (error) {
        return createErrorResult(`Failed to fetch posts: ${error.message}`)
      }

      const posts = data || []
      setCache(cacheKey, posts)

      return createSuccessResult(posts)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching posts: ${error}`)
    }
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

    try {
      // Special handling for 'home' slug - look for homepage
      if (slug === 'home') {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('website_domain', domain)
          .eq('is_homepage', true)
          .eq('status', 'published')
          .eq('is_published_to_domain', true)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            return createErrorResult('Homepage not found')
          }
          return createErrorResult(`Failed to fetch homepage: ${error.message}`)
        }

        setCache(cacheKey, data)
        return createSuccessResult(data)
      }

      // Regular slug lookup
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('website_domain', domain)
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('is_published_to_domain', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return createErrorResult('Page not found')
        }
        return createErrorResult(`Failed to fetch page: ${error.message}`)
      }

      setCache(cacheKey, data)
      return createSuccessResult(data)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching page: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(*),
          post_tags(tags(*))
        `)
        .eq('website_domain', domain)
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('is_published_to_domain', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return createErrorResult('Post not found')
        }
        return createErrorResult(`Failed to fetch post: ${error.message}`)
      }

      setCache(cacheKey, data)
      return createSuccessResult(data)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching post: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:user_profiles(id, full_name, avatar_url),
          categories!inner(*),
          post_tags(tags(*))
        `)
        .eq('website_domain', domain)
        .eq('status', 'published')
        .eq('is_published_to_domain', true)
        .eq('categories.slug', categorySlug)
        .order('created_at', { ascending: false })

      if (error) {
        return createErrorResult(`Failed to fetch posts by category: ${error.message}`)
      }

      const posts = data || []
      setCache(cacheKey, posts)

      return createSuccessResult(posts)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching posts by category: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(*),
          post_tags!inner(tags!inner(*))
        `)
        .eq('website_domain', domain)
        .eq('status', 'published')
        .eq('is_published_to_domain', true)
        .eq('post_tags.tags.slug', tagSlug)
        .order('created_at', { ascending: false })

      if (error) {
        return createErrorResult(`Failed to fetch posts by tag: ${error.message}`)
      }

      const posts = data || []
      setCache(cacheKey, posts)

      return createSuccessResult(posts)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching posts by tag: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(*),
          post_tags(tags(*))
        `)
        .eq('website_domain', domain)
        .eq('status', 'published')
        .eq('is_published_to_domain', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return createErrorResult(`Failed to fetch recent posts: ${error.message}`)
      }

      const posts = data || []
      setCache(cacheKey, posts)

      return createSuccessResult(posts)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching recent posts: ${error}`)
    }
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

    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('domain', domain)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Return default settings if none exist
          const defaultSettings = {
            domain,
            site_name: domain === 'staging.howtomecm.com' ? 'How to MeCM (Staging)' : 'How to MeCM',
            tagline: 'Professional Content Management',
            description: 'Learn how to manage your content effectively'
          }
          setCache(cacheKey, defaultSettings)
          return createSuccessResult(defaultSettings)
        }
        return createErrorResult(`Failed to fetch site settings: ${error.message}`)
      }

      setCache(cacheKey, data)
      return createSuccessResult(data)
    } catch (error) {
      return createErrorResult(`Unexpected error fetching site settings: ${error}`)
    }
  }

  /**
   * Search content across posts and pages
   */
  static async searchContent(domain: string, query: string): Promise<ContentResult<(Post | Page)[]>> {
    if (!query.trim()) {
      return createSuccessResult([])
    }

    try {
      const [postsResult, pagesResult] = await Promise.all([
        supabase
          .from('posts')
          .select(`
            *,
            categories(*),
            post_tags(tags(*))
          `)
          .eq('website_domain', domain)
          .eq('status', 'published')
          .eq('is_published_to_domain', true)
          .ilike('title', `%${query}%`)
          .order('created_at', { ascending: false }),

        supabase
          .from('pages')
          .select('*')
          .eq('website_domain', domain)
          .eq('status', 'published')
          .eq('is_published_to_domain', true)
          .ilike('title', `%${query}%`)
          .order('created_at', { ascending: false })
      ])

      if (postsResult.error || pagesResult.error) {
        return createErrorResult(`Search failed: ${postsResult.error?.message || pagesResult.error?.message}`)
      }

      const results = [
        ...(postsResult.data || []),
        ...(pagesResult.data || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      return createSuccessResult(results)
    } catch (error) {
      return createErrorResult(`Unexpected error during search: ${error}`)
    }
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

    try {
      // Call the database function to get published content by domain
      const { data, error } = await supabase
        .rpc('get_published_content_by_domain', {
          domain_name: domain
        })

      if (error) {
        return createErrorResult(`Failed to fetch homepage content: ${error.message}`)
      }

      if (!data || data.length === 0) {
        return createErrorResult('No published homepage content found for this domain')
      }

      // Get the first (latest) result
      const contentRow = data[0]
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
    } catch (error) {
      return createErrorResult(`Unexpected error fetching homepage content: ${error}`)
    }
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
      try {
        // For preview mode, we get the latest content regardless of published status
        const { data, error } = await supabase
          .from('homepage_content')
          .select('content, version_number, modified_at')
          .eq('environment_id', domain) // Assuming environment maps to domain
          .order('modified_at', { ascending: false })
          .limit(1)

        if (error) {
          return createErrorResult(`Failed to fetch preview content: ${error.message}`)
        }

        if (!data || data.length === 0) {
          // Fallback to published content if no preview content
          return ContentLibrary.getHomepageContent(domain, false)
        }

        const contentRow = data[0]
        const homepageContent = contentRow.content as CompleteHomepageContent

        if (!homepageContent || typeof homepageContent !== 'object') {
          return createErrorResult('Invalid preview content format')
        }

        return createSuccessResult(homepageContent)
      } catch (error) {
        return createErrorResult(`Unexpected error fetching preview content: ${error}`)
      }
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
          url: '/logo.png',
          alt: 'How to MeCM Logo',
          width: 120,
          height: 40
        },
        brand: {
          name: 'How to MeCM',
          tagline: 'Professional Microsoft Technology Consulting',
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
        subtitle: 'Your gateway to expert insights, comprehensive tutorials, and professional consulting on Microsoft technologies.',
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
          description: 'Watch comprehensive video tutorials, live demonstrations, and step-by-step implementation guides for Microsoft technologies.',
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
          subtitle: 'Professional insights',
          description: 'Connect with industry professionals, get exclusive insights, and stay updated with the latest Microsoft technology trends.',
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
        copyrightText: '© 2024 How to MeCM. All rights reserved. | Expert Microsoft Technology Consulting & Insights',
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
        pageTitle: 'How to MeCM - Professional Microsoft Technology Consulting',
        metaDescription: 'Expert insights on Microsoft Configuration Manager (MECM/SCCM), Azure cloud technologies, and enterprise solutions. Professional consulting and best practices for IT professionals.',
        keywords: ['Microsoft Configuration Manager', 'MECM', 'SCCM', 'Azure', 'Microsoft 365', 'IT consulting', 'enterprise solutions', 'cloud technologies'],
        openGraph: {
          title: 'How to MeCM - Professional Microsoft Technology Consulting',
          description: 'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
          image: '/og-image.jpg',
          url: baseUrl,
          siteName: 'How to MeCM',
          type: 'website',
          locale: 'en_US'
        },
        twitter: {
          card: 'summary_large_image',
          title: 'How to MeCM - Professional Microsoft Technology Consulting',
          description: 'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
          image: '/og-image.jpg'
        },
        structuredData: {
          organization: {
            name: 'How to MeCM',
            description: 'Professional Microsoft Technology Consulting & Insights',
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
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