'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import type { SiteSettings } from '@/types/site'
import type { FooterContent, HomepageContent, SiteNavigationConfig } from '@/types/site-content'

interface SiteContextType {
  settings: SiteSettings | null
  homepageContent: HomepageContent | null
  navigation: SiteNavigationConfig | null
  footerContent: FooterContent | null
  isPreviewMode: boolean
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

interface SiteProviderProps {
  children: ReactNode
  initialSettings?: SiteSettings | null
  initialHomepageContent?: HomepageContent | null
  initialNavigation?: SiteNavigationConfig | null
  initialFooterContent?: FooterContent | null
  initialPreviewMode?: boolean
}

export function SiteProvider({
  children,
  initialSettings = null,
  initialHomepageContent = null,
  initialNavigation = null,
  initialFooterContent = null,
  initialPreviewMode = false,
}: SiteProviderProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  // Apply theme class to document
  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const value: SiteContextType = {
    settings: initialSettings,
    homepageContent: initialHomepageContent,
    navigation: initialNavigation,
    footerContent: initialFooterContent,
    isPreviewMode: initialPreviewMode,
    theme,
    toggleTheme,
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider')
  }
  return context
}

// Convenience hooks
export function useSiteSettings() {
  const { settings } = useSite()
  return settings
}

export function useHomepageContent() {
  const { homepageContent } = useSite()
  return homepageContent
}

export function usePreviewMode() {
  const { isPreviewMode } = useSite()
  return isPreviewMode
}

export function useTheme() {
  const { theme, toggleTheme } = useSite()
  return { theme, toggleTheme }
}
