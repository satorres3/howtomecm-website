'use client'

import React from 'react'
import { SiteProvider } from '../contexts/SiteContext'
import { SWRProvider } from './SWRProvider'
import { LiveRegionProvider } from '../components/accessibility'
import type { Post } from '../../types/content'
import type { SiteSettings } from '@/types/site'
import type { FooterContent, HomepageContent, SiteNavigationConfig } from '@/types/site-content'

interface AppProvidersProps {
  children: React.ReactNode
  siteSettings?: SiteSettings | null
  homepageContent?: HomepageContent | null
  isPreviewMode?: boolean
  currentPost?: Post | null
  relatedPosts?: Post[]
  categories?: Array<{ id: string; name: string; slug: string }>
  tags?: Array<{ id: string; name: string; slug: string }>
  navigation?: SiteNavigationConfig | null
  footerContent?: FooterContent | null
}

export function AppProviders({
  children,
  siteSettings = null,
  homepageContent = null,
  isPreviewMode = false,
  currentPost = null,
  relatedPosts = [],
  categories = [],
  tags = [],
  navigation = null,
  footerContent = null
}: AppProvidersProps) {
  return (
    <SWRProvider>
      <LiveRegionProvider>
        <SiteProvider
          initialSettings={siteSettings}
          initialHomepageContent={homepageContent}
          initialPreviewMode={isPreviewMode}
          initialNavigation={navigation}
          initialFooterContent={footerContent}
        >
          {children}
        </SiteProvider>
      </LiveRegionProvider>
    </SWRProvider>
  )
}