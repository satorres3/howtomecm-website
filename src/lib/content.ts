import type { Post } from '../../types/content'
import type { SiteSettings } from '@/types/site'

import { demoPosts } from './demoContent'
import {
  loadAboutPageContent,
  loadBlogPageContent,
  loadCategories as loadCategoryConfig,
  loadContactPageContent,
  loadFooterContent,
  loadHomepageContent,
  loadNavigation,
  loadSiteSettings,
  loadTags as loadTagConfig,
} from './site-content'
import type {
  AboutPageContent,
  BlogPageContent,
  ContactPageContent,
  FooterContent,
  HomepageContent,
  SiteNavigationConfig,
} from '@/types/site-content'

const DEFAULT_DOMAIN = 'staging.howtomecm.com'

export type ContentResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: string }

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
  const categories = loadCategoryConfig().filter(category =>
    !category.website_domain || normalizeDomain(category.website_domain) === normalizedDomain
  )
  return success(categories)
}

async function getTags(domain: string) {
  const normalizedDomain = normalizeDomain(domain)
  const tags = loadTagConfig().filter(tag =>
    !tag.website_domain || normalizeDomain(tag.website_domain) === normalizedDomain
  )
  return success(tags)
}

async function getSiteSettings(domain: string): Promise<ContentResult<SiteSettings>> {
  const siteSettings = loadSiteSettings()
  const normalizedDomain = normalizeDomain(domain)
  if (normalizeDomain(siteSettings.domain) !== normalizedDomain) {
    return failure(`Unknown domain: ${domain}`)
  }

  return success(siteSettings)
}

async function getHomepageContentWithFallback(
  domain: string
): Promise<ContentResult<HomepageContent>> {
  const normalizedDomain = normalizeDomain(domain)
  const homepage = loadHomepageContent()

  if (normalizedDomain !== normalizeDomain(DEFAULT_DOMAIN)) {
    return failure(`Unknown domain: ${domain}`)
  }

  return success(homepage)
}

async function getBlogPageContent(): Promise<ContentResult<BlogPageContent>> {
  return success(loadBlogPageContent())
}

async function getAboutPageContent(): Promise<ContentResult<AboutPageContent>> {
  return success(loadAboutPageContent())
}

async function getContactPageContent(): Promise<ContentResult<ContactPageContent>> {
  return success(loadContactPageContent())
}

async function getFooterContent(): Promise<ContentResult<FooterContent>> {
  return success(loadFooterContent())
}

async function getNavigation(): Promise<ContentResult<SiteNavigationConfig>> {
  return success(loadNavigation())
}

export const ContentLibrary = {
  getAllPosts,
  getPostBySlug,
  getRecentPosts,
  getCategories,
  getSiteSettings,
  getHomepageContentWithFallback,
  getBlogPageContent,
  getAboutPageContent,
  getContactPageContent,
  getFooterContent,
  getNavigation,
  getTags
}

export {
  getAllPosts,
  getPostBySlug,
  getRecentPosts,
  getCategories,
  getSiteSettings,
  getHomepageContentWithFallback,
  getBlogPageContent,
  getAboutPageContent,
  getContactPageContent,
  getFooterContent,
  getNavigation,
  getTags
}
