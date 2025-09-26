import { selectOne, insert, update, withDatabaseErrorHandling } from './database'

export interface SiteSettings {
  id?: string
  domain: string
  site_name: string
  tagline?: string
  description?: string
  logo?: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  favicon?: {
    url: string
    type?: string
  }
  navigation: {
    header: NavigationItem[]
    footer: NavigationItem[]
  }
  social_links?: SocialLink[]
  contact_info?: {
    email?: string
    phone?: string
    address?: string
  }
  analytics?: {
    google_analytics_id?: string
    google_tag_manager_id?: string
    facebook_pixel_id?: string
  }
  seo?: {
    meta_title?: string
    meta_description?: string
    meta_keywords?: string
    og_image?: string
    twitter_handle?: string
  }
  legal?: {
    privacy_policy_url?: string
    terms_of_service_url?: string
    cookie_policy_url?: string
  }
  features?: {
    blog_enabled: boolean
    comments_enabled: boolean
    newsletter_enabled: boolean
    dark_mode_enabled: boolean
    search_enabled: boolean
  }
  integrations?: {
    mailchimp_api_key?: string
    stripe_public_key?: string
    recaptcha_site_key?: string
  }
  custom_css?: string
  custom_js?: string
  created_at?: string
  updated_at?: string
}

export interface NavigationItem {
  id: string
  label: string
  url: string
  type: 'internal' | 'external'
  target?: '_blank' | '_self'
  icon?: string
  children?: NavigationItem[]
  order: number
  is_active: boolean
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  label?: string
  is_active: boolean
  order: number
}

export interface SiteSettingsResult {
  success: boolean
  data: SiteSettings | null
  error: string | null
}

// Default site settings
export const defaultSiteSettings: Omit<SiteSettings, 'domain'> = {
  site_name: 'My Website',
  tagline: 'Welcome to my website',
  description: 'A modern, customizable website built with Next.js and Supabase.',
  navigation: {
    header: [
      {
        id: 'home',
        label: 'Home',
        url: '/',
        type: 'internal',
        order: 1,
        is_active: true
      },
      {
        id: 'about',
        label: 'About',
        url: '/about',
        type: 'internal',
        order: 2,
        is_active: true
      },
      {
        id: 'blog',
        label: 'Blog',
        url: '/blog',
        type: 'internal',
        order: 3,
        is_active: true
      },
      {
        id: 'contact',
        label: 'Contact',
        url: '/contact',
        type: 'internal',
        order: 4,
        is_active: true
      }
    ],
    footer: [
      {
        id: 'privacy',
        label: 'Privacy Policy',
        url: '/privacy',
        type: 'internal',
        order: 1,
        is_active: true
      },
      {
        id: 'terms',
        label: 'Terms of Service',
        url: '/terms',
        type: 'internal',
        order: 2,
        is_active: true
      }
    ]
  },
  social_links: [
    {
      id: 'twitter',
      platform: 'Twitter',
      url: '',
      icon: 'twitter',
      is_active: false,
      order: 1
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      url: '',
      icon: 'linkedin',
      is_active: false,
      order: 2
    },
    {
      id: 'github',
      platform: 'GitHub',
      url: '',
      icon: 'github',
      is_active: false,
      order: 3
    }
  ],
  features: {
    blog_enabled: true,
    comments_enabled: true,
    newsletter_enabled: false,
    dark_mode_enabled: true,
    search_enabled: false
  },
  seo: {
    meta_title: 'My Website',
    meta_description: 'A modern, customizable website built with Next.js and Supabase.'
  }
}

/**
 * Fetch site settings for a specific domain
 */
export async function getSiteSettings(domain: string): Promise<SiteSettingsResult> {
  return withDatabaseErrorHandling(async () => {
    const result = await selectOne<SiteSettings>('site_settings', '*', { domain })

    if (!result.success) {
      // No settings found, return default settings with domain
      return {
        success: true,
        data: { ...defaultSiteSettings, domain },
        error: null
      }
    }

    return {
      success: true,
      data: result.data!,
      error: null
    }
  }, 'getSiteSettings').then(result => result as SiteSettingsResult)
}

/**
 * Save site settings for a domain
 */
export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettingsResult> {
  return withDatabaseErrorHandling(async () => {
    // First try to update existing settings
    const updateResult = await update('site_settings', settings, { domain: settings.domain })

    if (updateResult.success) {
      return {
        success: true,
        data: updateResult.data as SiteSettings,
        error: null
      }
    }

    // If update fails, try to insert new settings
    const insertResult = await insert('site_settings', settings)

    if (!insertResult.success) {
      return {
        success: false,
        data: null,
        error: `Failed to save site settings: ${insertResult.error}`
      }
    }

    return {
      success: true,
      data: insertResult.data as SiteSettings,
      error: null
    }
  }, 'saveSiteSettings').then(result => result as SiteSettingsResult)
}

/**
 * Get active navigation items for header
 */
export function getActiveHeaderNavigation(settings: SiteSettings): NavigationItem[] {
  return settings.navigation.header
    .filter(item => item.is_active)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get active navigation items for footer
 */
export function getActiveFooterNavigation(settings: SiteSettings): NavigationItem[] {
  return settings.navigation.footer
    .filter(item => item.is_active)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get active social links
 */
export function getActiveSocialLinks(settings: SiteSettings): SocialLink[] {
  return (settings.social_links || [])
    .filter(link => link.is_active)
    .sort((a, b) => a.order - b.order)
}

/**
 * Generate structured data for SEO
 */
export function generateStructuredData(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.site_name,
    "description": settings.description,
    "url": `https://${settings.domain}`,
    "logo": settings.logo?.url ? `https://${settings.domain}${settings.logo.url}` : undefined,
    "sameAs": getActiveSocialLinks(settings).map(link => link.url).filter(Boolean),
    "contactPoint": settings.contact_info?.email ? {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": settings.contact_info.email,
      "availableLanguage": "English"
    } : undefined
  }
}

/**
 * Validate site settings
 */
export function validateSiteSettings(settings: Partial<SiteSettings>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!settings.domain) {
    errors.push('Domain is required')
  }

  if (!settings.site_name || settings.site_name.trim().length === 0) {
    errors.push('Site name is required')
  }

  if (settings.site_name && settings.site_name.length > 100) {
    errors.push('Site name must be less than 100 characters')
  }

  if (settings.description && settings.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }

  if (settings.seo?.meta_description && settings.seo.meta_description.length > 160) {
    errors.push('Meta description should be less than 160 characters for optimal SEO')
  }

  // Validate navigation items
  if (settings.navigation?.header) {
    settings.navigation.header.forEach((item, index) => {
      if (!item.label || item.label.trim().length === 0) {
        errors.push(`Header navigation item ${index + 1} must have a label`)
      }
      if (!item.url || item.url.trim().length === 0) {
        errors.push(`Header navigation item ${index + 1} must have a URL`)
      }
    })
  }

  // Validate social links
  if (settings.social_links) {
    settings.social_links.forEach((link, index) => {
      if (link.is_active && (!link.url || link.url.trim().length === 0)) {
        errors.push(`Social link ${index + 1} (${link.platform}) must have a URL if active`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}