// ========================================
// HOMEPAGE CONTENT TYPES
// ========================================
// Types for CMS-driven homepage content integration

export interface NavigationItem {
  id: string
  label: string
  url: string
  target?: '_self' | '_blank'
  order: number
  isActive: boolean
  children?: NavigationItem[]
}

export interface SocialLink {
  id: string
  platform: 'Facebook' | 'Twitter' | 'Instagram' | 'LinkedIn' | 'YouTube' | 'GitHub' | string
  url: string
  icon?: React.ElementType
  isActive?: boolean
}

// Header Content (every editable element)
export interface HeaderContent {
  id: string
  environmentId: string
  logo: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  brand: {
    name: string
    tagline: string
    primaryColor: string
    secondaryColor: string
  }
  navigation: {
    items: NavigationItem[]
    searchPlaceholder: string
  }
  socialLinks: {
    youtube: {
      url: string
      title: string
      backgroundColor: string
    }
    linkedin: {
      url: string
      title: string
      backgroundColor: string
    }
  }
  lastModified: string
}

// Welcome Section Content
export interface WelcomeSection {
  id: string
  mainHeading: string
  subtitle: string
  gradientColors: {
    from: string
    via: string
    to: string
    darkFrom: string
    darkVia: string
    darkTo: string
  }
  isActive: boolean
}

// Promotional Card Content
export interface PromotionalCard {
  id: string
  type: 'youtube' | 'linkedin' | 'custom'
  title: string
  subtitle: string
  description: string
  url: string
  target: '_self' | '_blank'
  gradientColors: {
    from: string
    via: string
    to: string
  }
  icon?: {
    type: 'svg' | 'image'
    content: string // SVG code or image URL
  } | null
  order: number
  isActive: boolean
}

// Featured Video Section
export interface FeaturedVideoSection {
  id: string
  title: string
  description: string
  video: {
    title: string
    description: string
    embedUrl?: string
    thumbnailUrl?: string
    placeholderImage?: string
    platform?: 'youtube' | 'vimeo' | 'custom' | null
    videoId?: string
    autoplay?: boolean
    lazyLoad?: boolean
  }
  styling: {
    aspectRatio: '16:9' | '4:3' | '1:1'
    backgroundColor: string
    gradientColors: {
      from: string
      to: string
    }
    playButtonColor: string
    borderRadius: number
  }
  isActive: boolean
}

// Articles Section Configuration
export interface ArticlesSection {
  id: string
  title: string
  description: string
  displaySettings: {
    postsPerPage: number
    showPagination: boolean
    gridColumns: 2 | 3 | 4
    showExcerpts: boolean
    showAuthor: boolean
    showDate: boolean
    showCategory: boolean
    showTags: boolean
    showFeaturedImages: boolean
    excerptMaxLines: 2 | 3 | 4
    titleMaxLines: 1 | 2 | 3
  }
  layoutSettings: {
    cardBorderRadius: number
    shadowIntensity: 'none' | 'light' | 'medium' | 'strong'
    hoverEffect: 'scale' | 'shadow' | 'none'
    imageAspectRatio: '16:9' | '4:3' | '1:1' | 'auto'
  }
  sortingSettings: {
    defaultSort: 'date-newest' | 'date-oldest' | 'title-asc' | 'title-desc'
    enableCategoryFilter: boolean
    enableSearch: boolean
    loadMoreStyle: 'pagination' | 'load-more' | 'infinite-scroll'
  }
  paginationText: {
    next: string
    previous: string
    page: string
    loadMore: string
  }
  isActive: boolean
}

// Footer Configuration
export interface FooterColumn {
  id: string
  title: string
  links: NavigationItem[]
  order: number
}

export interface FooterSettings {
  id: string
  environmentId: string
  copyrightText: string
  showSocialLinks: boolean
  socialLinks: SocialLink[]
  footerColumns: FooterColumn[]
  customHtml?: string
  backgroundColor?: string
  textColor?: string
  lastModified: string
}

// SEO and Metadata Content
export interface SEOContent {
  id: string
  environmentId: string
  pageTitle: string
  metaDescription: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    image: string
    url: string
    siteName: string
    type: string
    locale: string
  }
  twitter: {
    card: string
    title: string
    description: string
    image: string
  }
  structuredData: {
    organization: {
      name: string
      description: string
      url: string
      logo: string
      sameAs: string[]
    }
    contactPoint: {
      contactType: string
      availableLanguage: string
    }
  }
  robots: {
    index: boolean
    follow: boolean
    maxImagePreview: string
    maxVideoPreview: number
    maxSnippet: number
  }
  canonicalUrl: string
  lastModified: string
}

// Background and Theme Settings
export interface BackgroundSettings {
  id: string
  environmentId: string
  ambientGradient: {
    isActive: boolean
    baseColors: {
      light: {
        primary: string
        secondary: string
        tertiary: string
      }
      dark: {
        primary: string
        secondary: string
        tertiary: string
      }
    }
    animatedBlobs: {
      isActive: boolean
      blobs: Array<{
        id: string
        size: number
        position: { x: string; y: string }
        colors: { from: string; to: string }
        animationDelay: string
        blur: number
      }>
    }
  }
  lastModified: string
}

// Complete Homepage Content Structure
export interface CompleteHomepageContent {
  id: string
  environmentId: string
  header: HeaderContent
  welcome: WelcomeSection
  dynamicHero: {
    isActive: boolean
    postsToShow: number
    showSidebar: boolean
  }
  promotionalCards: PromotionalCard[]
  featuredVideo: FeaturedVideoSection
  articles: ArticlesSection
  footer: FooterSettings
  seo: SEOContent
  background: BackgroundSettings
  lastModified: string
  modifiedBy: string
}
