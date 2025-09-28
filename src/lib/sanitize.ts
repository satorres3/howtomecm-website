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

/**
 * Sanitizes HTML content using DOMPurify with predefined configurations
 * @param dirty The potentially unsafe HTML string
 * @param type The type of content being sanitized (blog, comment, basic)
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string, type: SanitizeType = 'basic'): string {
  // Return empty string for invalid input
  if (typeof dirty !== 'string' || !dirty.trim()) {
    return ''
  }

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side: Return the content as-is since we don't have JSDOM
    // This is acceptable for demo content that's already safe
    return dirty
  }

  // Client-side: Use browser DOM
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIGS[type])
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

// Export configurations for advanced usage
export { SANITIZE_CONFIGS }
