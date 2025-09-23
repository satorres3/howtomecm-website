// ========================================
// CMS DATA ADAPTERS FOR WEBSITE COMPONENTS
// ========================================
// Utilities for transforming CMS data into website component formats

import type { CompleteHomepageContent, HeaderContent, WelcomeSection, PromotionalCard, FeaturedVideoSection, ArticlesSection, FooterSettings, SEOContent, BackgroundSettings } from '../types/homepage'
import type { Metadata } from 'next'

/**
 * Adapter for transforming CMS header data into component props
 */
export class HeaderAdapter {
  static toComponentProps(header: HeaderContent) {
    return {
      logo: {
        src: header.logo.url,
        alt: header.logo.alt,
        width: header.logo.width || 120,
        height: header.logo.height || 40,
      },
      brand: {
        name: header.brand.name,
        tagline: header.brand.tagline,
        colors: {
          primary: header.brand.primaryColor,
          secondary: header.brand.secondaryColor,
        },
      },
      navigation: header.navigation.items.filter(item => item.isActive).map(item => ({
        label: item.label,
        href: item.url,
        target: item.target || '_self',
        order: item.order,
      })),
      socialLinks: {
        youtube: {
          href: header.socialLinks.youtube.url,
          title: header.socialLinks.youtube.title,
          backgroundColor: header.socialLinks.youtube.backgroundColor,
        },
        linkedin: {
          href: header.socialLinks.linkedin.url,
          title: header.socialLinks.linkedin.title,
          backgroundColor: header.socialLinks.linkedin.backgroundColor,
        },
      },
      searchPlaceholder: header.navigation.searchPlaceholder,
    }
  }
}

/**
 * Adapter for transforming CMS welcome section data
 */
export class WelcomeSectionAdapter {
  static toComponentProps(welcome: WelcomeSection) {
    if (!welcome.isActive) {
      return null
    }

    return {
      heading: welcome.mainHeading,
      subtitle: welcome.subtitle,
      gradientConfig: {
        from: welcome.gradientColors.from,
        via: welcome.gradientColors.via,
        to: welcome.gradientColors.to,
        darkFrom: welcome.gradientColors.darkFrom,
        darkVia: welcome.gradientColors.darkVia,
        darkTo: welcome.gradientColors.darkTo,
      },
    }
  }
}

/**
 * Adapter for transforming CMS promotional cards data
 */
export class PromotionalCardsAdapter {
  static toComponentProps(cards: PromotionalCard[]) {
    return cards
      .filter(card => card.isActive)
      .sort((a, b) => a.order - b.order)
      .map(card => ({
        id: card.id,
        type: card.type,
        title: card.title,
        subtitle: card.subtitle,
        description: card.description,
        href: card.url,
        target: card.target,
        gradientColors: {
          from: card.gradientColors.from,
          via: card.gradientColors.via,
          to: card.gradientColors.to,
        },
        icon: card.icon ? {
          type: card.icon.type,
          content: card.icon.content,
        } : null,
      }))
  }
}

/**
 * Adapter for transforming CMS featured video data
 */
export class FeaturedVideoAdapter {
  static toComponentProps(video: FeaturedVideoSection) {
    if (!video.isActive) {
      return null
    }

    return {
      title: video.title,
      description: video.description,
      video: {
        title: video.video.title,
        description: video.video.description,
        embedUrl: video.video.embedUrl,
        thumbnailUrl: video.video.thumbnailUrl,
        platform: video.video.platform,
        videoId: video.video.videoId,
        autoplay: video.video.autoplay || false,
        lazyLoad: video.video.lazyLoad !== false, // Default to true
      },
      styling: {
        aspectRatio: video.styling.aspectRatio,
        backgroundColor: video.styling.backgroundColor,
        gradientColors: {
          from: video.styling.gradientColors.from,
          to: video.styling.gradientColors.to,
        },
        playButtonColor: video.styling.playButtonColor,
        borderRadius: video.styling.borderRadius,
      },
    }
  }
}

/**
 * Adapter for transforming CMS articles section data
 */
export class ArticlesSectionAdapter {
  static toComponentProps(articles: ArticlesSection) {
    if (!articles.isActive) {
      return null
    }

    return {
      title: articles.title,
      description: articles.description,
      displayConfig: {
        postsPerPage: articles.displaySettings.postsPerPage,
        showPagination: articles.displaySettings.showPagination,
        gridColumns: articles.displaySettings.gridColumns,
        showExcerpts: articles.displaySettings.showExcerpts,
        showAuthor: articles.displaySettings.showAuthor,
        showDate: articles.displaySettings.showDate,
        showCategory: articles.displaySettings.showCategory,
        showTags: articles.displaySettings.showTags,
        showFeaturedImages: articles.displaySettings.showFeaturedImages,
        excerptMaxLines: articles.displaySettings.excerptMaxLines,
        titleMaxLines: articles.displaySettings.titleMaxLines,
      },
      layoutConfig: {
        cardBorderRadius: articles.layoutSettings.cardBorderRadius,
        shadowIntensity: articles.layoutSettings.shadowIntensity,
        hoverEffect: articles.layoutSettings.hoverEffect,
        imageAspectRatio: articles.layoutSettings.imageAspectRatio,
      },
      sortingConfig: {
        defaultSort: articles.sortingSettings.defaultSort,
        enableCategoryFilter: articles.sortingSettings.enableCategoryFilter,
        enableSearch: articles.sortingSettings.enableSearch,
        loadMoreStyle: articles.sortingSettings.loadMoreStyle,
      },
      paginationText: articles.paginationText,
    }
  }
}

/**
 * Adapter for transforming CMS footer data
 */
export class FooterAdapter {
  static toComponentProps(footer: FooterSettings) {
    return {
      copyrightText: footer.copyrightText,
      socialLinks: footer.showSocialLinks
        ? footer.socialLinks
            .filter(link => link.isActive)
            .map(link => ({
              platform: link.platform,
              url: link.url,
              icon: link.icon,
            }))
        : [],
      columns: footer.footerColumns
        .sort((a, b) => a.order - b.order)
        .map(column => ({
          title: column.title,
          links: column.links
            .filter(link => link.isActive)
            .sort((a, b) => a.order - b.order)
            .map(link => ({
              label: link.label,
              href: link.url,
              target: link.target || '_self',
            })),
        })),
      styling: {
        backgroundColor: footer.backgroundColor,
        textColor: footer.textColor,
      },
      customHtml: footer.customHtml,
    }
  }
}

/**
 * Adapter for transforming CMS SEO data into Next.js Metadata
 */
export class SEOAdapter {
  static toNextMetadata(seo: SEOContent): Metadata {
    return {
      title: seo.pageTitle,
      description: seo.metaDescription,
      keywords: seo.keywords.join(', '),
      authors: [{ name: seo.structuredData.organization.name }],
      openGraph: {
        title: seo.openGraph.title,
        description: seo.openGraph.description,
        type: seo.openGraph.type as any,
        url: seo.openGraph.url,
        siteName: seo.openGraph.siteName,
        locale: seo.openGraph.locale,
        images: [
          {
            url: seo.openGraph.image,
            width: 1200,
            height: 630,
            alt: seo.openGraph.title,
          },
        ],
      },
      twitter: {
        card: seo.twitter.card as any,
        title: seo.twitter.title,
        description: seo.twitter.description,
        images: [seo.twitter.image],
      },
      robots: {
        index: seo.robots.index,
        follow: seo.robots.follow,
        googleBot: {
          index: seo.robots.index,
          follow: seo.robots.follow,
          'max-video-preview': seo.robots.maxVideoPreview,
          'max-image-preview': seo.robots.maxImagePreview as any,
          'max-snippet': seo.robots.maxSnippet,
        },
      },
      alternates: {
        canonical: seo.canonicalUrl,
      },
    }
  }

  /**
   * Generate structured data (JSON-LD) for the page
   */
  static toStructuredData(seo: SEOContent) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: seo.structuredData.organization.name,
      description: seo.structuredData.organization.description,
      url: seo.structuredData.organization.url,
      logo: seo.structuredData.organization.logo,
      sameAs: seo.structuredData.organization.sameAs,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: seo.structuredData.contactPoint.contactType,
        availableLanguage: seo.structuredData.contactPoint.availableLanguage,
      },
    }
  }
}

/**
 * Adapter for transforming CMS background settings into CSS variables and classes
 */
export class BackgroundAdapter {
  static toCSSVariables(background: BackgroundSettings) {
    if (!background.ambientGradient.isActive) {
      return {}
    }

    const cssVars: Record<string, string> = {}

    // Base gradient colors
    cssVars['--bg-gradient-light-primary'] = background.ambientGradient.baseColors.light.primary
    cssVars['--bg-gradient-light-secondary'] = background.ambientGradient.baseColors.light.secondary
    cssVars['--bg-gradient-light-tertiary'] = background.ambientGradient.baseColors.light.tertiary

    cssVars['--bg-gradient-dark-primary'] = background.ambientGradient.baseColors.dark.primary
    cssVars['--bg-gradient-dark-secondary'] = background.ambientGradient.baseColors.dark.secondary
    cssVars['--bg-gradient-dark-tertiary'] = background.ambientGradient.baseColors.dark.tertiary

    return cssVars
  }

  static toBlobConfig(background: BackgroundSettings) {
    if (!background.ambientGradient.isActive || !background.ambientGradient.animatedBlobs.isActive) {
      return []
    }

    return background.ambientGradient.animatedBlobs.blobs.map(blob => ({
      id: blob.id,
      size: blob.size,
      position: blob.position,
      colors: blob.colors,
      animationDelay: blob.animationDelay,
      blur: blob.blur,
      className: `absolute rounded-full animate-pulse`,
      style: {
        width: `${blob.size}px`,
        height: `${blob.size}px`,
        left: blob.position.x,
        top: blob.position.y,
        background: `linear-gradient(to bottom right, ${blob.colors.from}, ${blob.colors.to})`,
        filter: `blur(${blob.blur}px)`,
        animationDelay: blob.animationDelay,
      },
    }))
  }

  static toBackgroundClasses(background: BackgroundSettings): string {
    if (!background.ambientGradient.isActive) {
      return 'bg-white dark:bg-gray-900'
    }

    // Generate Tailwind classes for the background gradient
    return 'bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20'
  }
}

/**
 * Main adapter class that orchestrates all content transformations
 */
export class HomepageContentAdapter {
  /**
   * Transform complete CMS homepage content into component-ready data
   */
  static transform(content: CompleteHomepageContent) {
    return {
      header: HeaderAdapter.toComponentProps(content.header),
      welcome: WelcomeSectionAdapter.toComponentProps(content.welcome),
      promotionalCards: PromotionalCardsAdapter.toComponentProps(content.promotionalCards),
      featuredVideo: FeaturedVideoAdapter.toComponentProps(content.featuredVideo),
      articles: ArticlesSectionAdapter.toComponentProps(content.articles),
      footer: FooterAdapter.toComponentProps(content.footer),
      seo: {
        metadata: SEOAdapter.toNextMetadata(content.seo),
        structuredData: SEOAdapter.toStructuredData(content.seo),
      },
      background: {
        cssVariables: BackgroundAdapter.toCSSVariables(content.background),
        blobConfig: BackgroundAdapter.toBlobConfig(content.background),
        backgroundClasses: BackgroundAdapter.toBackgroundClasses(content.background),
      },
      dynamicHero: content.dynamicHero,
      meta: {
        lastModified: content.lastModified,
        modifiedBy: content.modifiedBy,
      },
    }
  }

  /**
   * Extract just the SEO metadata for page generation
   */
  static extractMetadata(content: CompleteHomepageContent): Metadata {
    return SEOAdapter.toNextMetadata(content.seo)
  }

  /**
   * Extract background configuration for styling
   */
  static extractBackgroundConfig(content: CompleteHomepageContent) {
    return {
      cssVariables: BackgroundAdapter.toCSSVariables(content.background),
      blobConfig: BackgroundAdapter.toBlobConfig(content.background),
      backgroundClasses: BackgroundAdapter.toBackgroundClasses(content.background),
    }
  }

  /**
   * Validate content structure and provide fallbacks
   */
  static validateAndSanitize(content: CompleteHomepageContent): CompleteHomepageContent {
    // Basic validation and sanitization
    const sanitized = { ...content }

    // Ensure required fields exist
    if (!sanitized.header?.brand?.name) {
      sanitized.header = {
        ...sanitized.header,
        brand: {
          ...sanitized.header?.brand,
          name: 'How to MeCM',
          tagline: 'Professional Content Management',
          primaryColor: '#2563eb',
          secondaryColor: '#7c3aed',
        },
      } as HeaderContent
    }

    // Filter out inactive promotional cards
    if (sanitized.promotionalCards) {
      sanitized.promotionalCards = sanitized.promotionalCards.filter(card => card.isActive)
    }

    // Ensure SEO has required fields
    if (!sanitized.seo?.pageTitle) {
      sanitized.seo = {
        ...sanitized.seo,
        pageTitle: 'How to MeCM - Professional Content Management',
        metaDescription: 'Expert insights and professional content management solutions.',
      } as SEOContent
    }

    return sanitized
  }
}