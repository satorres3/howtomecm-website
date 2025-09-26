'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeConfig, defaultTheme, applyThemeToDocument, createThemeStyleElement, getThemeConfig } from '../lib/theme'

interface ThemeContextType {
  theme: ThemeConfig
  isLoading: boolean
  error: string | null
  updateTheme: (newTheme: Partial<ThemeConfig>) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  domain: string
  initialTheme?: ThemeConfig
}

export function ThemeProvider({
  children,
  domain,
  initialTheme
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme || { ...defaultTheme, domain })
  const [isLoading, setIsLoading] = useState(!initialTheme)
  const [error, setError] = useState<string | null>(null)

  // Load theme from CMS on mount
  useEffect(() => {
    if (initialTheme) {
      applyThemeToDocument(initialTheme)
      createThemeStyleElement(initialTheme)
      return
    }

    const loadTheme = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getThemeConfig(domain)

        if (result.success && result.data) {
          setTheme(result.data)
          applyThemeToDocument(result.data)
          createThemeStyleElement(result.data)
        } else {
          setError(result.error || 'Failed to load theme')
          // Use default theme as fallback
          const fallbackTheme = { ...defaultTheme, domain }
          setTheme(fallbackTheme)
          applyThemeToDocument(fallbackTheme)
          createThemeStyleElement(fallbackTheme)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading theme'
        setError(errorMessage)
        // Use default theme as fallback
        const fallbackTheme = { ...defaultTheme, domain }
        setTheme(fallbackTheme)
        applyThemeToDocument(fallbackTheme)
        createThemeStyleElement(fallbackTheme)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [domain, initialTheme])

  // Update theme function
  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    const updatedTheme = {
      ...theme,
      ...newTheme,
      domain, // Ensure domain is always set
      colors: newTheme.colors ? { ...theme.colors, ...newTheme.colors } : theme.colors,
      typography: newTheme.typography ? { ...theme.typography, ...newTheme.typography } : theme.typography,
      layout: newTheme.layout ? { ...theme.layout, ...newTheme.layout } : theme.layout,
      components: newTheme.components ? { ...theme.components, ...newTheme.components } : theme.components,
      animations: newTheme.animations ? { ...theme.animations, ...newTheme.animations } : theme.animations,
      breakpoints: newTheme.breakpoints ? { ...theme.breakpoints, ...newTheme.breakpoints } : theme.breakpoints
    }

    setTheme(updatedTheme)
    applyThemeToDocument(updatedTheme)
    createThemeStyleElement(updatedTheme)
  }

  // Reset to default theme
  const resetTheme = () => {
    const resetThemeConfig = { ...defaultTheme, domain }
    setTheme(resetThemeConfig)
    applyThemeToDocument(resetThemeConfig)
    createThemeStyleElement(resetThemeConfig)
    setError(null)
  }

  const value: ThemeContextType = {
    theme,
    isLoading,
    error,
    updateTheme,
    resetTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Convenience hooks for specific theme sections
export function useThemeColors() {
  const { theme } = useTheme()
  return theme.colors
}

export function useThemeTypography() {
  const { theme } = useTheme()
  return theme.typography
}

export function useThemeLayout() {
  const { theme } = useTheme()
  return theme.layout
}

export function useThemeComponents() {
  const { theme } = useTheme()
  return theme.components
}

export function useThemeAnimations() {
  const { theme } = useTheme()
  return theme.animations
}

export function useThemeBreakpoints() {
  const { theme } = useTheme()
  return theme.breakpoints
}