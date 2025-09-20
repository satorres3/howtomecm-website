import { Metadata } from 'next'
import { getPageBySlug, getPages } from '../../lib/supabase'
import ContentRenderer from '../../components/ContentRenderer'
import { notFound } from 'next/navigation'

const DOMAIN = process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static pages at build time
export async function generateStaticParams() {
  const pages = await getPages(DOMAIN)

  return pages
    .filter(page => page.slug !== 'home') // Exclude home page
    .map(page => ({
      slug: page.slug,
    }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(DOMAIN, params.slug)

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
  const page = await getPageBySlug(DOMAIN, params.slug)

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