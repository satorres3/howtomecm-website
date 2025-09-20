import { Metadata } from 'next'
import { ContentLibrary } from '../../../lib/content'
import ContentRenderer from '../../components/ContentRenderer'
import { notFound } from 'next/navigation'
import type { Page } from '../../../types/content'

const DOMAIN = process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static pages at build time
export async function generateStaticParams() {
  const pagesResult = await ContentLibrary.getAllPages(DOMAIN)
  const pages = pagesResult.success ? pagesResult.data || [] : []

  return pages
    .filter(page => page.slug !== 'home') // Exclude home page
    .map(page => ({
      slug: page.slug,
    }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const pageResult = await ContentLibrary.getPageBySlug(DOMAIN, resolvedParams.slug)
  const page = pageResult.success ? pageResult.data : null

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || `Learn about ${page.title}`,
    keywords: page.seo?.focusKeyword ? [page.seo.focusKeyword] : undefined,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params
  const pageResult = await ContentLibrary.getPageBySlug(DOMAIN, resolvedParams.slug)
  const page = pageResult.success ? pageResult.data : null

  if (!page) {
    notFound()
  }

  return (
    <ContentRenderer
      title={page.title}
      sections={page.sections || []}
      seo={page.seo}
    />
  )
}