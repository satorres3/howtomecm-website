export interface SiteLogo {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface SiteColorPalette {
  primary: string
  secondary: string
}

export interface SiteSocialLinkRecord {
  youtube?: string
  linkedin?: string
  twitter?: string
  github?: string
  [key: string]: string | undefined
}

export interface SiteSocialLinkItem {
  platform: string
  url: string
  enabled?: boolean
}

export interface SiteSettings {
  domain: string
  site_name: string
  tagline: string
  description: string
  author?: string
  keywords?: string[]
  logo?: SiteLogo
  logo_url?: string
  colors?: SiteColorPalette
  social_links?: SiteSocialLinkRecord
}
