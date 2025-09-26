import { selectOne, insert, update, withDatabaseErrorHandling } from './database'

export interface ThemeConfig {
  id?: string
  domain: string
  colors: {
    primary: string
    secondary: string
    accent: string
    neutral: string
    'base-100': string
    'base-200': string
    'base-300': string
    'base-content': string
    success: string
    warning: string
    error: string
    info: string
  }
  typography: {
    'font-family-primary': string
    'font-family-secondary': string
    'font-size-xs': string
    'font-size-sm': string
    'font-size-base': string
    'font-size-lg': string
    'font-size-xl': string
    'font-size-2xl': string
    'font-size-3xl': string
    'font-size-4xl': string
    'font-size-5xl': string
    'font-size-6xl': string
    'line-height-tight': string
    'line-height-snug': string
    'line-height-normal': string
    'line-height-relaxed': string
    'line-height-loose': string
  }
  layout: {
    'container-max-width': string
    'container-padding': string
    'section-padding-y': string
    'section-padding-x': string
    'border-radius-sm': string
    'border-radius-md': string
    'border-radius-lg': string
    'border-radius-xl': string
    'spacing-xs': string
    'spacing-sm': string
    'spacing-md': string
    'spacing-lg': string
    'spacing-xl': string
    'spacing-2xl': string
    'spacing-3xl': string
  }
  components?: {
    button?: {
      'border-radius': string
      'padding-x': string
      'padding-y': string
      'font-weight': string
    }
    card?: {
      'border-radius': string
      'box-shadow': string
      padding: string
    }
    input?: {
      'border-radius': string
      'border-width': string
      padding: string
    }
  }
  animations?: {
    'transition-duration': string
    'transition-timing-function': string
    'hover-scale': string
    'hover-opacity': string
  }
  breakpoints?: {
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
  created_at?: string
  updated_at?: string
}

export interface ThemeResult {
  success: boolean
  data: ThemeConfig | null
  error: string | null
}

// Default theme configuration
export const defaultTheme: ThemeConfig = {
  domain: '',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    neutral: '#374151',
    'base-100': '#ffffff',
    'base-200': '#f9fafb',
    'base-300': '#f3f4f6',
    'base-content': '#1f2937',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  typography: {
    'font-family-primary': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-family-secondary': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size-xs': '0.75rem',
    'font-size-sm': '0.875rem',
    'font-size-base': '1rem',
    'font-size-lg': '1.125rem',
    'font-size-xl': '1.25rem',
    'font-size-2xl': '1.5rem',
    'font-size-3xl': '1.875rem',
    'font-size-4xl': '2.25rem',
    'font-size-5xl': '3rem',
    'font-size-6xl': '3.75rem',
    'line-height-tight': '1.25',
    'line-height-snug': '1.375',
    'line-height-normal': '1.5',
    'line-height-relaxed': '1.625',
    'line-height-loose': '2'
  },
  layout: {
    'container-max-width': '1200px',
    'container-padding': '1rem',
    'section-padding-y': '4rem',
    'section-padding-x': '1rem',
    'border-radius-sm': '0.125rem',
    'border-radius-md': '0.375rem',
    'border-radius-lg': '0.5rem',
    'border-radius-xl': '0.75rem',
    'spacing-xs': '0.25rem',
    'spacing-sm': '0.5rem',
    'spacing-md': '1rem',
    'spacing-lg': '1.5rem',
    'spacing-xl': '2rem',
    'spacing-2xl': '3rem',
    'spacing-3xl': '4rem'
  },
  components: {
    button: {
      'border-radius': '0.375rem',
      'padding-x': '1rem',
      'padding-y': '0.5rem',
      'font-weight': '500'
    },
    card: {
      'border-radius': '0.5rem',
      'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '1.5rem'
    },
    input: {
      'border-radius': '0.375rem',
      'border-width': '1px',
      padding: '0.5rem 0.75rem'
    }
  },
  animations: {
    'transition-duration': '300ms',
    'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'hover-scale': '1.05',
    'hover-opacity': '0.8'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
}

/**
 * Fetch theme configuration for a specific domain
 */
export async function getThemeConfig(domain: string): Promise<ThemeResult> {
  return withDatabaseErrorHandling(async () => {
    const result = await selectOne<ThemeConfig>('themes', '*', { domain })

    if (!result.success) {
      // No theme found, return default theme with domain
      return {
        success: true,
        data: { ...defaultTheme, domain },
        error: null
      }
    }

    return {
      success: true,
      data: result.data!,
      error: null
    }
  }, 'getThemeConfig').then(result => result as ThemeResult)
}

/**
 * Save theme configuration for a domain
 */
export async function saveThemeConfig(themeConfig: ThemeConfig): Promise<ThemeResult> {
  return withDatabaseErrorHandling(async () => {
    // First try to update existing theme
    const updateResult = await update('themes', themeConfig, { domain: themeConfig.domain })

    if (updateResult.success) {
      return {
        success: true,
        data: updateResult.data as ThemeConfig,
        error: null
      }
    }

    // If update fails, try to insert new theme
    const insertResult = await insert('themes', themeConfig)

    if (!insertResult.success) {
      return {
        success: false,
        data: null,
        error: `Failed to save theme: ${insertResult.error}`
      }
    }

    return {
      success: true,
      data: insertResult.data as ThemeConfig,
      error: null
    }
  }, 'saveThemeConfig').then(result => result as ThemeResult)
}

/**
 * Convert theme config to CSS variables
 */
export function themeConfigToCSSVariables(theme: ThemeConfig): Record<string, string> {
  const cssVariables: Record<string, string> = {}

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    cssVariables[`--color-${key}`] = value
  })

  // Typography
  Object.entries(theme.typography).forEach(([key, value]) => {
    cssVariables[`--${key}`] = value
  })

  // Layout
  Object.entries(theme.layout).forEach(([key, value]) => {
    cssVariables[`--${key}`] = value
  })

  // Components
  if (theme.components) {
    Object.entries(theme.components).forEach(([componentKey, componentStyles]) => {
      Object.entries(componentStyles).forEach(([styleKey, styleValue]) => {
        cssVariables[`--${componentKey}-${styleKey}`] = styleValue
      })
    })
  }

  // Animations
  if (theme.animations) {
    Object.entries(theme.animations).forEach(([key, value]) => {
      cssVariables[`--${key}`] = value
    })
  }

  // Breakpoints
  if (theme.breakpoints) {
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      cssVariables[`--breakpoint-${key}`] = value
    })
  }

  return cssVariables
}

/**
 * Generate CSS string from theme config
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  const cssVariables = themeConfigToCSSVariables(theme)
  const cssString = Object.entries(cssVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  return `:root {\n${cssString}\n}`
}

/**
 * Apply theme to document (client-side only)
 */
export function applyThemeToDocument(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return

  const cssVariables = themeConfigToCSSVariables(theme)

  Object.entries(cssVariables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
}

/**
 * Create a theme style element (client-side only)
 */
export function createThemeStyleElement(theme: ThemeConfig, id: string = 'dynamic-theme'): HTMLStyleElement | null {
  if (typeof document === 'undefined') return null

  // Remove existing theme style element
  const existingStyle = document.getElementById(id)
  if (existingStyle) {
    existingStyle.remove()
  }

  // Create new style element
  const style = document.createElement('style')
  style.id = id
  style.textContent = generateThemeCSS(theme)

  document.head.appendChild(style)

  return style
}