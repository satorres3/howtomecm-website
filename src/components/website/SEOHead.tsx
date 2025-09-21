import type { SEOData, Post, Page } from '../../../types/content'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string

  // Support for CMS SEO data
  seoData?: SEOData
  content?: Post | Page

  // Legacy support
  articleData?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    tags?: string[]
  }
  siteData?: {
    siteName: string
    siteUrl: string
    twitterHandle?: string
  }
}

// Helper function to extract SEO data from CMS content
const extractSEOFromContent = (content: Post | Page | undefined, seoData: SEOData | undefined) => {
  const defaultSEO = {
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    twitterCard: 'summary_large_image' as const,
    canonicalUrl: '',
    noindex: false,
    nofollow: false
  }

  // Priority: explicit seoData > content.seo > defaults
  const extracted = {
    ...defaultSEO,
    ...(content?.seo || {}),
    ...(seoData || {})
  }

  return extracted
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  seoData,
  content,
  articleData,
  siteData,
}: SEOHeadProps) {
  // Extract SEO data from CMS content if available
  const cmsSeO = extractSEOFromContent(content, seoData)

  // Use CMS SEO data with fallbacks to props
  const finalTitle = cmsSeO.metaTitle || title
  const finalDescription = cmsSeO.metaDescription || description
  const finalOGImage = cmsSeO.ogImage || ogImage
  const finalCanonicalUrl = cmsSeO.canonicalUrl || canonicalUrl

  const fullTitle = siteData?.siteName ? `${finalTitle} | ${siteData.siteName}` : finalTitle
  const imageUrl = finalOGImage || `${siteData?.siteUrl}/og-image.jpg`
  const url = finalCanonicalUrl || siteData?.siteUrl

  // Extract keywords from CMS content if available
  const finalKeywords = keywords || (cmsSeO.focusKeyword ? [cmsSeO.focusKeyword] : [])

  // Generate structured data for articles with CMS support
  const generateArticleSchema = () => {
    // Use CMS content data if available, fallback to legacy articleData
    const hasContentData = content && 'date' in content // Check if it's a Post
    const hasArticleData = articleData && siteData

    if (!hasContentData && !hasArticleData) return null

    // Extract article data from CMS or legacy source
    const schemaData = hasContentData ? {
      headline: finalTitle,
      description: finalDescription,
      image: imageUrl,
      url: url,
      datePublished: content.date,
      dateModified: content.updated_at || content.date,
      author: content.author?.full_name || 'Anonymous',
      keywords: content.tags?.map(tag => tag.name).join(', ') || ''
    } : {
      headline: finalTitle,
      description: finalDescription,
      image: imageUrl,
      url: url,
      datePublished: articleData!.publishedTime,
      dateModified: articleData!.modifiedTime || articleData!.publishedTime,
      author: articleData!.author || 'Anonymous',
      keywords: articleData!.tags?.join(', ') || ''
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      ...schemaData,
      publisher: {
        '@type': 'Organization',
        name: siteData?.siteName || 'Website',
        logo: {
          '@type': 'ImageObject',
          url: `${siteData?.siteUrl || ''}/logo.png`,
        },
      },
    }
  }

  const articleSchema = generateArticleSchema()

  return (
    <>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalKeywords && finalKeywords.length > 0 && (
        <meta name="keywords" content={finalKeywords.join(', ')} />
      )}

      {/* Canonical URL */}
      {finalCanonicalUrl && <link rel="canonical" href={finalCanonicalUrl} />}

      {/* Robots meta tags from CMS */}
      {cmsSeO.noindex && <meta name="robots" content="noindex" />}
      {cmsSeO.nofollow && <meta name="robots" content="nofollow" />}

      {/* Open Graph tags with CMS support */}
      <meta property="og:title" content={cmsSeO.ogTitle || fullTitle} />
      <meta property="og:description" content={cmsSeO.ogDescription || finalDescription} />
      <meta property="og:type" content={(content && 'date' in content) || articleData ? 'article' : 'website'} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      {siteData?.siteName && (
        <meta property="og:site_name" content={siteData.siteName} />
      )}

      {/* Article-specific Open Graph tags with CMS support */}
      {(content && 'date' in content) && (
        <>
          <meta property="article:published_time" content={content.date} />
          <meta property="article:modified_time" content={content.updated_at || content.date} />
          {content.author?.full_name && (
            <meta property="article:author" content={content.author.full_name} />
          )}
          {content.tags?.map((tag) => (
            <meta key={tag.id} property="article:tag" content={tag.name} />
          ))}
        </>
      )}
      {/* Legacy article data support */}
      {!content && articleData && (
        <>
          {articleData.publishedTime && (
            <meta property="article:published_time" content={articleData.publishedTime} />
          )}
          {articleData.modifiedTime && (
            <meta property="article:modified_time" content={articleData.modifiedTime} />
          )}
          {articleData.author && (
            <meta property="article:author" content={articleData.author} />
          )}
          {articleData.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card tags with CMS support */}
      <meta name="twitter:card" content={cmsSeO.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={cmsSeO.twitterTitle || fullTitle} />
      <meta name="twitter:description" content={cmsSeO.twitterDescription || finalDescription} />
      <meta name="twitter:image" content={cmsSeO.twitterImage || imageUrl} />
      {siteData?.twitterHandle && (
        <meta name="twitter:site" content={siteData.twitterHandle} />
      )}

      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />

      {/* Structured data */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}

      {/* Favicon and app icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* RSS feed */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${siteData?.siteName} RSS Feed`}
        href="/rss.xml"
      />
    </>
  )
}