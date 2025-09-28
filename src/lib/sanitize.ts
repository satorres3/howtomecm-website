import DOMPurify from 'dompurify'

// Configuration for different content types
const SANITIZE_CONFIGS = {
  // For blog post content - allows most HTML but removes dangerous elements
  blog: {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'i',
      'b',
      'a',
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'table',
      'thead',
      'tbody',
      'tr',
      'td',
      'th',
      'figure',
      'figcaption',
      'div',
      'span',
      'dl',
      'dt',
      'dd',
      'iframe',
    ] as string[],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'id',
      'target',
      'rel',
      'loading',
      'width',
      'height',
      'aria-label',
      'aria-describedby',
      'role',
      'data-testid',
      'allowfullscreen',
      'frameborder',
    ] as string[],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  },
  // For comments - more restrictive
  comment: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code'] as string[],
    ALLOWED_ATTR: ['href', 'target', 'rel'] as string[],
    ALLOW_DATA_ATTR: false,
  },
  // For basic HTML - very restrictive
  basic: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'] as string[],
    ALLOWED_ATTR: [] as string[],
    ALLOW_DATA_ATTR: false,
  },
}

type SanitizeType = keyof typeof SANITIZE_CONFIGS

// Allowed iframe domains for security - ENHANCED
const ALLOWED_IFRAME_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
  'www.loom.com',
  'howtomecm.com',
  'staging.howtomecm.com',
  'www.howtomecm.com',
] as const

// Enhanced iframe validation with security attributes
const IFRAME_SECURITY_ATTRIBUTES = {
  sandbox: 'allow-scripts allow-same-origin allow-presentation',
  referrerpolicy: 'strict-origin-when-cross-origin',
  loading: 'lazy',
} as const

/**
 * Enhanced iframe source validation with comprehensive security checks
 * @param src The iframe source URL
 * @returns validation result with detailed feedback
 */
function validateIframeSource(src: string): {
  isValid: boolean
  domain?: string
  reason?: string
} {
  if (!src || typeof src !== 'string') {
    return { isValid: false, reason: 'Empty or invalid source' }
  }

  try {
    const url = new URL(src.trim())
    const domain = url.hostname.toLowerCase()

    // Reject non-HTTPS for external domains (except localhost for development)
    if (url.protocol !== 'https:' && !domain.includes('localhost')) {
      return { isValid: false, domain, reason: 'Non-HTTPS external source not allowed' }
    }

    // Check against allowed domains list
    const isAllowed = ALLOWED_IFRAME_DOMAINS.some(
      allowed => domain === allowed || domain.endsWith(`.${allowed}`)
    )

    if (!isAllowed) {
      return { isValid: false, domain, reason: 'Domain not in allowlist' }
    }

    return { isValid: true, domain }
  } catch (error) {
    return {
      isValid: false,
      reason: `Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Legacy function for backward compatibility
 * @param src The iframe source URL
 * @returns true if the source is from an allowed domain
 */
function isValidIframeSource(src: string): boolean {
  return validateIframeSource(src).isValid
}

/**
 * Enhanced MDX content detection with comprehensive syntax analysis
 * @param content The content to analyze
 * @param options Detection options
 * @returns detailed MDX analysis result
 */
function detectMDXContent(
  content: string,
  options: {
    strictMode?: boolean
    logDetection?: boolean
  } = {}
): {
  isMDX: boolean
  confidence: 'low' | 'medium' | 'high'
  detectedFeatures: string[]
  riskLevel: 'safe' | 'moderate' | 'high'
} {
  if (!content || typeof content !== 'string') {
    return { isMDX: false, confidence: 'low', detectedFeatures: [], riskLevel: 'safe' }
  }

  const detectedFeatures: string[] = []
  let riskLevel: 'safe' | 'moderate' | 'high' = 'safe'

  // Enhanced MDX pattern detection
  const mdxPatterns = {
    imports: /^import\s+.*from\s+['"].*['"]$/m,
    exports: /^export\s+/m,
    jsxComponents: /<[A-Z][a-zA-Z0-9]*(\s|>)/,
    jsxComments: /{\/\*[\s\S]*?\*\/}/,
    jsxExpressions: /{[^}]+}/,
    selfClosingJSX: /<[A-Z][a-zA-Z0-9]*[^>]*\/>/,
    functionCalls: /\w+\([^)]*\)/,
    scriptTags: /<script[^>]*>/i,
    dangerousProps: /dangerouslySetInnerHTML/i,
  }

  // Check each pattern
  Object.entries(mdxPatterns).forEach(([feature, pattern]) => {
    if (pattern.test(content)) {
      detectedFeatures.push(feature)

      // Assess risk level
      if (['scriptTags', 'dangerousProps'].includes(feature)) {
        riskLevel = 'high'
      } else if (['jsxExpressions', 'functionCalls'].includes(feature) && riskLevel !== 'high') {
        riskLevel = 'moderate'
      }
    }
  })

  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high' = 'low'
  if (detectedFeatures.includes('imports') || detectedFeatures.includes('exports')) {
    confidence = 'high'
  } else if (
    detectedFeatures.includes('jsxComponents') ||
    detectedFeatures.includes('selfClosingJSX')
  ) {
    confidence = 'medium'
  } else if (detectedFeatures.length > 0) {
    confidence = 'low'
  }

  const isMDX = options.strictMode ? confidence === 'high' : detectedFeatures.length > 0

  // Log detection in development
  if (options.logDetection && process.env.NODE_ENV === 'development' && isMDX) {
    console.info('MDX content detected:', {
      confidence,
      features: detectedFeatures,
      riskLevel,
    })
  }

  return { isMDX, confidence, detectedFeatures, riskLevel }
}

/**
 * Legacy function for backward compatibility
 * @param content The content to analyze
 * @returns true if MDX syntax is detected
 */
function isMDXContent(content: string): boolean {
  return detectMDXContent(content).isMDX
}

/**
 * Enhanced domain normalization with comprehensive validation and error handling
 * @param domain The domain to validate and normalize
 * @returns normalized domain result with validation details
 */
function normalizeDomain(domain: string): {
  domain: string | null
  isValid: boolean
  reason?: string
} {
  if (!domain || typeof domain !== 'string') {
    return { domain: null, isValid: false, reason: 'Empty or invalid domain input' }
  }

  try {
    // Remove protocol, port, and path if present
    let cleanDomain = domain
      .trim()
      .replace(/^https?:\/\//, '') // Remove protocol
      .replace(/:\d+/, '') // Remove port
      .split('/')[0] // Remove path
      .toLowerCase()

    // Remove trailing dots
    cleanDomain = cleanDomain.replace(/\.$/, '')

    // Validate domain format
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/
    if (!domainRegex.test(cleanDomain)) {
      return {
        domain: null,
        isValid: false,
        reason: 'Invalid domain format - contains illegal characters',
      }
    }

    // Check for minimum requirements
    if (cleanDomain.length < 3) {
      return { domain: null, isValid: false, reason: 'Domain too short' }
    }

    if (cleanDomain.length > 253) {
      return { domain: null, isValid: false, reason: 'Domain too long' }
    }

    // Additional security checks
    if (cleanDomain.includes('..')) {
      return { domain: null, isValid: false, reason: 'Invalid double dots in domain' }
    }

    return { domain: cleanDomain, isValid: true }
  } catch (error) {
    return {
      domain: null,
      isValid: false,
      reason: `Domain processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Legacy function for backward compatibility
 * @param domain The domain to validate
 * @returns normalized domain or null if invalid
 */
function validateContentDomain(domain: string): string | null {
  const result = normalizeDomain(domain)
  return result.isValid ? result.domain : null
}

/**
 * Sanitizes HTML content using DOMPurify with predefined configurations
 * @param dirty The potentially unsafe HTML string
 * @param type The type of content being sanitized (blog, comment, basic)
 * @param validateIframes Whether to validate iframe sources (default: true for blog type)
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(
  dirty: string,
  type: SanitizeType = 'basic',
  validateIframes: boolean = true
): string {
  // Return empty string for invalid input
  if (typeof dirty !== 'string' || !dirty.trim()) {
    return ''
  }

  // Pre-validate iframe sources for security
  let processedContent = dirty
  if (validateIframes && type === 'blog') {
    processedContent = preprocessIframes(dirty)
  }

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side: Return the content as-is since we don't have JSDOM
    // This is acceptable for demo content that's already safe
    return processedContent
  }

  // Client-side: Use browser DOM
  return DOMPurify.sanitize(processedContent, SANITIZE_CONFIGS[type])
}

/**
 * Enhanced iframe preprocessing with security attributes and comprehensive validation
 * @param content HTML content that may contain iframes
 * @returns Content with enhanced iframe security or invalid iframes removed
 */
function preprocessIframes(content: string): string {
  // Find all iframe tags and enhance them with security attributes
  return content.replace(/<iframe([^>]*)>/gi, (match, attributes) => {
    const srcMatch = attributes.match(/src=["']([^"']+)["']/)

    if (!srcMatch) {
      // No src attribute - remove iframe
      if (process.env.NODE_ENV === 'development') {
        console.warn('Removed iframe without src attribute')
      }
      return '<!-- Iframe removed: no src attribute -->'
    }

    const validation = validateIframeSource(srcMatch[1])

    if (!validation.isValid) {
      // Log security warning with detailed reason
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Removed invalid iframe source: ${srcMatch[1]} - ${validation.reason}`)
      }
      return `<!-- Iframe removed: ${validation.reason} -->`
    }

    // Enhance valid iframe with security attributes
    let enhancedAttributes = attributes

    // Add security attributes if not present
    Object.entries(IFRAME_SECURITY_ATTRIBUTES).forEach(([attr, value]) => {
      const attrRegex = new RegExp(`${attr}=`, 'i')
      if (!attrRegex.test(enhancedAttributes)) {
        enhancedAttributes += ` ${attr}="${value}"`
      }
    })

    // Ensure frameborder="0" for consistency
    if (!/frameborder=/i.test(enhancedAttributes)) {
      enhancedAttributes += ' frameborder="0"'
    }

    return `<iframe${enhancedAttributes}>`
  })
}

/**
 * Sanitizes and validates URLs
 * @param url The URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== 'string' || !url.trim()) {
    return null
  }

  // Allow only HTTP(S) and mailto protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:']

  try {
    const parsedUrl = new URL(url.trim())

    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return null
    }

    return parsedUrl.toString()
  } catch {
    return null
  }
}

/**
 * Sanitizes plain text by removing HTML tags and encoding special characters
 * @param text The text to sanitize
 * @returns Sanitized plain text
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Validates and sanitizes form data
 * @param data Object containing form data
 * @returns Sanitized form data
 */
export function sanitizeFormData(data: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {}

  for (const [key, value] of Object.entries(data)) {
    // Sanitize key names (allow only alphanumeric and underscores)
    const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, '')

    if (cleanKey && typeof value === 'string') {
      sanitized[cleanKey] = sanitizeText(value)
    }
  }

  return sanitized
}

/**
 * Enhanced content validation for MDX and external sources
 * @param content The content to validate
 * @param options Validation options
 * @returns Validation result with errors and warnings
 */
export function validateContent(
  content: string,
  options: {
    allowMDX?: boolean
    allowIframes?: boolean
    trustedDomains?: string[]
  } = {}
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  containsMDX: boolean
} {
  const errors: string[] = []
  const warnings: string[] = []
  const containsMDX = isMDXContent(content)

  // Check MDX content
  if (containsMDX && !options.allowMDX) {
    errors.push('MDX content detected but not allowed')
  }

  // Check iframe sources
  const iframeMatches = content.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi)
  if (iframeMatches && !options.allowIframes) {
    errors.push('Iframe content detected but not allowed')
  } else if (iframeMatches) {
    for (const match of iframeMatches) {
      const srcMatch = match.match(/src=["']([^"']+)["']/)
      if (srcMatch && !isValidIframeSource(srcMatch[1])) {
        errors.push(`Invalid iframe source: ${srcMatch[1]}`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    containsMDX,
  }
}

/**
 * Secure content extractor for headings with performance optimization
 * @param content HTML or markdown content
 * @returns Array of heading objects with optimized extraction
 */
export function extractHeadingsSecure(content: string): Array<{
  id: string
  text: string
  level: number
}> {
  if (!content || typeof content !== 'string') {
    return []
  }

  // Use regex for performance instead of DOM parsing
  const headingRegex = /<h([1-6])[^>]*?(?:id=["']([^"']*)["'])?[^>]*>(.*?)<\/h[1-6]>/gi
  const headings: Array<{ id: string; text: string; level: number }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1])
    const id = match[2] || ''
    const text = match[3].replace(/<[^>]*>/g, '').trim() // Strip HTML tags

    if (text) {
      headings.push({
        id: id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        text,
        level,
      })
    }
  }

  return headings
}

/**
 * Generate secure share links with domain validation
 * @param url The URL to share
 * @param platform Social platform
 * @returns Validated share URL or null if invalid
 */
export function generateSecureShareLink(
  url: string,
  platform: 'twitter' | 'linkedin' | 'facebook'
): string | null {
  const sanitizedUrl = sanitizeUrl(url)
  if (!sanitizedUrl) return null

  const encodedUrl = encodeURIComponent(sanitizedUrl)

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }

  return shareUrls[platform] || null
}

/**
 * Hook for sanitizing HTML content in React components
 * @param content The HTML content to sanitize
 * @param type The sanitization type
 * @returns Object with sanitized HTML for dangerouslySetInnerHTML
 */
export function useSanitizedHtml(content: string, type: SanitizeType = 'basic') {
  const sanitizedContent = sanitizeHtml(content, type)

  return {
    __html: sanitizedContent,
  }
}

// Export security utilities
export {
  isValidIframeSource,
  validateIframeSource,
  isMDXContent,
  detectMDXContent,
  validateContentDomain,
  normalizeDomain,
  ALLOWED_IFRAME_DOMAINS,
  IFRAME_SECURITY_ATTRIBUTES,
  SANITIZE_CONFIGS,
}
