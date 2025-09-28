import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'
import type { Post, UserProfile, Category, Tag } from '../../types/content'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { loadCategories, loadTags } from './site-content'
import { validateContent, sanitizeHtml } from './sanitize'

const contentDirectory = path.join(process.cwd(), 'content')
const postsDirectory = path.join(contentDirectory, 'posts')
const authorsDirectory = path.join(contentDirectory, 'authors')

// Author cache
let authorsCache: Record<string, UserProfile> | null = null

/**
 * Enhanced authors loader with comprehensive JSON parsing protection
 * @returns Dictionary of loaded author profiles with error handling
 */
export function getAuthors(): Record<string, UserProfile> {
  if (authorsCache) {
    return authorsCache
  }

  authorsCache = {}

  try {
    // Check if authors directory exists
    if (!fs.existsSync(authorsDirectory)) {
      if (process.env.NODE_ENV === 'development') {
        console.info('Authors directory not found, using empty authors cache')
      }
      return authorsCache
    }

    // Read directory with error handling
    let authorFiles: string[]
    try {
      authorFiles = fs.readdirSync(authorsDirectory)
    } catch (dirError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to read authors directory:', dirError)
      }
      return authorsCache
    }

    // Process each author file with individual error handling
    for (const file of authorFiles) {
      if (!file.endsWith('.json')) {
        continue
      }

      try {
        const filePath = path.join(authorsDirectory, file)

        // Security check: ensure the path is within authors directory
        const resolvedPath = path.resolve(filePath)
        const resolvedAuthorsDir = path.resolve(authorsDirectory)
        if (!resolvedPath.startsWith(resolvedAuthorsDir)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Skipped author file outside directory: ${file}`)
          }
          continue
        }

        // Check file size to prevent memory exhaustion
        const stats = fs.statSync(filePath)
        const maxFileSize = 1024 * 1024 // 1MB limit for author files
        if (stats.size > maxFileSize) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Skipped oversized author file: ${file} (${stats.size} bytes)`)
          }
          continue
        }

        // Read and parse file with comprehensive error handling
        const fileContent = fs.readFileSync(filePath, 'utf8')

        if (!fileContent.trim()) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Skipped empty author file: ${file}`)
          }
          continue
        }

        let author: any
        try {
          author = JSON.parse(fileContent)
        } catch (parseError) {
          if (process.env.NODE_ENV === 'development') {
            const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown error'
            console.warn(`Failed to parse author file ${file}: ${errorMsg}`)
          }
          continue
        }

        // Validate author object structure
        if (!author || typeof author !== 'object') {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Invalid author object in file ${file}: not an object`)
          }
          continue
        }

        if (!author.id || typeof author.id !== 'string') {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Invalid author in file ${file}: missing or invalid id`)
          }
          continue
        }

        // Store valid author
        authorsCache[author.id] = author as UserProfile

        if (process.env.NODE_ENV === 'development') {
          console.debug(`Loaded author: ${author.id} from ${file}`)
        }
      } catch (fileError) {
        if (process.env.NODE_ENV === 'development') {
          const errorMsg = fileError instanceof Error ? fileError.message : 'Unknown error'
          console.warn(`Error processing author file ${file}: ${errorMsg}`)
        }
        // Continue processing other files
        continue
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.info(`Loaded ${Object.keys(authorsCache).length} author profiles`)
    }
  } catch (unexpectedError) {
    if (process.env.NODE_ENV === 'development') {
      const errorMsg = unexpectedError instanceof Error ? unexpectedError.message : 'Unknown error'
      console.warn(`Unexpected error loading authors: ${errorMsg}`)
    }
    // Return empty cache on unexpected errors
    authorsCache = {}
  }

  return authorsCache
}

const demoCategories: Category[] = loadCategories().map(category => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  website_domain: category.website_domain || 'staging.howtomecm.com',
  created_at: category.created_at || new Date(2025, 1, 1).toISOString(),
}))

const demoTags: Tag[] = loadTags().map(tag => ({
  id: tag.id,
  name: tag.name,
  slug: tag.slug,
  description: tag.description,
  website_domain: tag.website_domain || 'staging.howtomecm.com',
  created_at: tag.created_at || new Date(2025, 1, 1).toISOString(),
}))

// Get post with serialized MDX content with security validation
export async function getPostWithSerializedContent(slug: string): Promise<{
  post: Post
  serializedContent: MDXRemoteSerializeResult
  validationWarnings?: string[]
} | null> {
  const posts = getAllPosts()
  const post = posts.find(p => p.slug === slug)

  if (!post) return null

  try {
    // Validate content before processing
    const validation = validateContent(post.content || '', {
      allowMDX: true,
      allowIframes: true,
      trustedDomains: ['youtube.com', 'www.youtube.com', 'player.vimeo.com'],
    })

    if (!validation.isValid) {
      console.warn(`Content validation failed for ${slug}:`, validation.errors)
      // For development, continue with warnings; for production, could reject
      if (
        process.env.NODE_ENV === 'production' &&
        validation.errors.some(e => e.includes('Invalid iframe'))
      ) {
        return null
      }
    }

    // Sanitize content for blog rendering (allows iframes from trusted sources)
    const sanitizedContent = sanitizeHtml(post.content || '', 'blog')

    const serializedContent = await serialize(sanitizedContent, {
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    })

    return {
      post,
      serializedContent,
      validationWarnings: validation.warnings.length > 0 ? validation.warnings : undefined,
    }
  } catch (error) {
    console.error(`Error serializing MDX content for ${slug}:`, error)
    return null
  }
}

// Get all MDX posts
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const authors = getAuthors()

  const posts = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const fullPath = path.join(postsDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Calculate reading time
      const stats = readingTime(content)

      // Find author
      const authorId = typeof data.author === 'string' ? data.author : undefined
      const author = authorId ? authors[authorId] : undefined

      // Find category
      const categorySlug = typeof data.category === 'string' ? data.category : undefined
      const category = categorySlug
        ? demoCategories.find(cat => cat.slug === categorySlug)
        : undefined

      // Parse tags
      const postTags = Array.isArray(data.tags)
        ? data.tags
            .map(tagSlug =>
              typeof tagSlug === 'string' ? demoTags.find(tag => tag.slug === tagSlug) : undefined
            )
            .filter((tag): tag is Tag => Boolean(tag))
        : []

      return {
        id: `mdx-post-${path.basename(name, '.mdx')}`,
        title: typeof data.title === 'string' ? data.title : path.basename(name, '.mdx'),
        slug: typeof data.slug === 'string' ? data.slug : path.basename(name, '.mdx'),
        excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
        content,
        status: 'published' as const,
        website_domain: 'staging.howtomecm.com',
        is_published_to_domain: true,
        created_at: typeof data.date === 'string' ? data.date : new Date().toISOString(),
        updated_at:
          typeof data.updated === 'string'
            ? data.updated
            : typeof data.date === 'string'
              ? data.date
              : new Date().toISOString(),
        date: typeof data.date === 'string' ? data.date : new Date().toISOString(),
        featured_image: typeof data.featuredImage === 'string' ? data.featuredImage : undefined,
        author_id: authorId,
        author,
        category_id: category?.id,
        category,
        category_slug: categorySlug,
        tags: postTags,
        comments_enabled: false,
        is_featured: Boolean(data.featured),
        reading_time: Math.ceil(stats.minutes),
      } as Post
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

// Get post by slug
export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

// Get recent posts
export function getRecentPosts(limit: number = 5): Post[] {
  const posts = getAllPosts()
  return posts.slice(0, limit)
}

// Get posts by category
export function getPostsByCategory(categorySlug: string): Post[] {
  const posts = getAllPosts()
  return posts.filter(post => post.category_slug === categorySlug)
}

// Get posts by tag
export function getPostsByTag(tagSlug: string): Post[] {
  const posts = getAllPosts()
  return posts.filter(post => post.tags?.some(tag => tag.slug === tagSlug))
}

// Export categories and tags
export function getCategories(): Category[] {
  return demoCategories
}

export function getTags(): Tag[] {
  return demoTags
}

// Backward compatibility exports
export const getMDXPosts = getAllPosts
export const getMDXCategories = getCategories
export const getMDXAuthors = getAuthors
export const getMDXTags = getTags

export const findMDXPost = getPostBySlug
