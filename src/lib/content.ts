import type { Post } from '../../types/content'
import type { SiteSettings } from '@/types/site'

import { demoPosts, demoCategories } from './demoContent'

const DEFAULT_DOMAIN = 'staging.howtomecm.com'

export type ContentResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: string }

const staticSiteSettings: SiteSettings = {
  domain: DEFAULT_DOMAIN,
  site_name: 'How to MeCM',
  tagline: 'Endpoint management knowledge hub',
  description:
    'Deep technical guides, lab notes, and deployment experiments for Microsoft endpoint administrators.',
  logo: {
    url: '/images/branding/portal-logo.svg',
    alt: 'How to MeCM logo',
    width: 56,
    height: 56
  },
  colors: {
    primary: '#0ea5e9',
    secondary: '#6366f1'
  },
  social_links: {
    youtube: 'https://youtube.com/@howtomecm',
    linkedin: 'https://linkedin.com/in/sauloalvestorres'
  },
  author: 'How to MeCM Team',
  keywords: [
    'Microsoft Intune',
    'Microsoft Endpoint Manager',
    'Configuration Manager',
    'Device management'
  ]
}

const staticHomepageContent = {
  welcome: {
    mainHeading: 'Endpoint management knowledge center',
    subtitle:
      'Hands-on guides, lab notes, and deployment experiments for Microsoft endpoint administrators.'
  },
  seo: {
    pageTitle: 'How to MeCM – Endpoint management knowledge hub',
    metaDescription:
      'Deep technical guides, walkthroughs, and community resources for Microsoft endpoint teams.'
  }
}

function normalizeDomain(domain: string | undefined): string {
  return (domain || DEFAULT_DOMAIN).trim().toLowerCase()
}

function success<T>(data: T): ContentResult<T> {
  return { success: true, data, error: null }
}

function failure<T>(message: string): ContentResult<T> {
  return { success: false, data: null, error: message }
}

function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function filterPostsByDomain(posts: Post[], domain: string): Post[] {
  const normalizedDomain = normalizeDomain(domain)
  return posts.filter(post => normalizeDomain(post.website_domain) === normalizedDomain)
}

async function getAllPosts(domain: string): Promise<ContentResult<Post[]>> {
  const posts = sortPostsByDate(filterPostsByDomain(demoPosts, domain))
  return success(posts)
}

async function getPostBySlug(domain: string, slug: string): Promise<ContentResult<Post>> {
  const posts = filterPostsByDomain(demoPosts, domain)
  const post = posts.find(item => item.slug === slug)

  if (!post) {
    return failure(`Post not found: ${slug}`)
  }

  return success(post)
}

async function getRecentPosts(domain: string, limit: number = 5): Promise<ContentResult<Post[]>> {
  const posts = sortPostsByDate(filterPostsByDomain(demoPosts, domain)).slice(0, limit)
  return success(posts)
}

async function getCategories(domain: string) {
  const normalizedDomain = normalizeDomain(domain)
  const categories = demoCategories.filter(category => normalizeDomain(category.website_domain) === normalizedDomain)
  return success(categories)
}

async function getSiteSettings(domain: string): Promise<ContentResult<SiteSettings>> {
  const normalizedDomain = normalizeDomain(domain)
  if (normalizedDomain !== normalizeDomain(staticSiteSettings.domain)) {
    return failure(`Unknown domain: ${domain}`)
  }
  return success(staticSiteSettings)
}

async function getHomepageContentWithFallback(domain: string) {
  const normalizedDomain = normalizeDomain(domain)
  if (normalizedDomain !== normalizeDomain(DEFAULT_DOMAIN)) {
    return failure(`Unknown domain: ${domain}`)
  }
  return success(staticHomepageContent)
}

export const ContentLibrary = {
  getAllPosts,
  getPostBySlug,
  getRecentPosts,
  getCategories,
  getSiteSettings,
  getHomepageContentWithFallback
}

export {
  getAllPosts,
  getPostBySlug,
  getRecentPosts,
  getCategories,
  getSiteSettings,
  getHomepageContentWithFallback
}
