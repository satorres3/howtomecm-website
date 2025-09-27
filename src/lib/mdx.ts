import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'
import type { Post, UserProfile, Category, Tag } from '../../types/content'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

const contentDirectory = path.join(process.cwd(), 'content')
const postsDirectory = path.join(contentDirectory, 'posts')
const authorsDirectory = path.join(contentDirectory, 'authors')

// Author cache
let authorsCache: Record<string, UserProfile> | null = null

// Load authors from JSON files
export function getAuthors(): Record<string, UserProfile> {
  if (authorsCache) {
    return authorsCache
  }

  authorsCache = {}

  if (!fs.existsSync(authorsDirectory)) {
    return authorsCache
  }

  const authorFiles = fs.readdirSync(authorsDirectory)

  for (const file of authorFiles) {
    if (file.endsWith('.json')) {
      const filePath = path.join(authorsDirectory, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const author = JSON.parse(fileContent)
      authorsCache[author.id] = author
    }
  }

  return authorsCache
}

// Demo categories - keeping these static for now
const demoCategories: Category[] = [
  {
    id: 'demo-category-intune',
    name: 'Intune',
    slug: 'intune',
    description: 'Real-world policy design, reporting, and zero trust alignment.',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(2025, 1, 5).toISOString(),
  },
  {
    id: 'demo-category-mecm',
    name: 'Microsoft Endpoint Configuration Manager',
    slug: 'mecm',
    description: 'Real-world MECM guides for on-premise device management.',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(2025, 1, 10).toISOString(),
  },
]

// Demo tags - keeping these static for now
const demoTags: Tag[] = [
  {
    id: 'demo-tag-azure',
    name: 'Azure',
    slug: 'azure',
    description: 'Microsoft Azure cloud platform',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(2025, 1, 1).toISOString(),
  },
  {
    id: 'demo-tag-powershell',
    name: 'PowerShell',
    slug: 'powershell',
    description: 'PowerShell automation and scripting',
    website_domain: 'staging.howtomecm.com',
    created_at: new Date(2025, 1, 2).toISOString(),
  },
]

// Get post with serialized MDX content
export async function getPostWithSerializedContent(
  slug: string
): Promise<{ post: Post; serializedContent: MDXRemoteSerializeResult } | null> {
  const posts = getAllPosts()
  const post = posts.find(p => p.slug === slug)

  if (!post) return null

  try {
    const serializedContent = await serialize(post.content || '', {
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    })

    return { post, serializedContent }
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
      const author = data.author ? authors[data.author] : undefined

      // Find category
      const category = demoCategories.find(cat => cat.slug === data.category)

      // Parse tags
      const postTags = Array.isArray(data.tags)
        ? data.tags
            .map((tagSlug: string) => demoTags.find(tag => tag.slug === tagSlug))
            .filter(Boolean)
        : []

      return {
        id: `mdx-post-${path.basename(name, '.mdx')}`,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content,
        status: 'published' as const,
        website_domain: 'staging.howtomecm.com',
        is_published_to_domain: true,
        created_at: data.date || new Date().toISOString(),
        updated_at: data.updated || data.date || new Date().toISOString(),
        date: data.date || new Date().toISOString(),
        featured_image: data.featuredImage,
        author_id: data.author,
        author,
        category_id: category?.id,
        category,
        category_slug: data.category,
        tags: postTags,
        comments_enabled: false,
        is_featured: data.featured || false,
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
