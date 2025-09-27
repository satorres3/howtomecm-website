'use client'

import React from 'react'
import { SiteProvider } from '../contexts/SiteContext'
import { SWRProvider } from './SWRProvider'
import { LiveRegionProvider } from '../components/accessibility'
import type { CompleteHomepageContent } from '../../types/homepage'
import type { Post } from '../../types/content'

interface SiteSettings {
  domain: string
  site_name: string
  tagline: string
  description: string
  logo?: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  colors?: {
    primary: string
    secondary: string
  }
  social_links?: {
    youtube?: string
    linkedin?: string
    twitter?: string
    github?: string
  }
}

interface AppProvidersProps {
  children: React.ReactNode
  siteSettings?: SiteSettings | null
  homepageContent?: CompleteHomepageContent | null
  isPreviewMode?: boolean
  currentPost?: Post | null
  relatedPosts?: Post[]
  categories?: Array<{ id: string; name: string; slug: string }>
  tags?: Array<{ id: string; name: string; slug: string }>
}

export function AppProviders({
  children,
  siteSettings = null,
  homepageContent = null,
  isPreviewMode = false,
  currentPost = null,
  relatedPosts = [],
  categories = [],
  tags = []
}: AppProvidersProps) {
  return (
    <SWRProvider>
      <LiveRegionProvider>
        <SiteProvider
          initialSettings={siteSettings}
          initialHomepageContent={homepageContent}
          initialPreviewMode={isPreviewMode}
        >
          {children}
        </SiteProvider>
      </LiveRegionProvider>
    </SWRProvider>
  )
}