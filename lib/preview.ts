// ========================================
// PREVIEW MODE FUNCTIONALITY
// ========================================
// Utilities for handling CMS preview mode with token validation

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Preview configuration
export const PREVIEW_TOKEN_COOKIE = 'cms_preview_token'
export const PREVIEW_MODE_COOKIE = 'cms_preview_mode'
export const PREVIEW_TOKEN_HEADER = 'x-preview-token'

/**
 * Generate a secure preview token
 */
export function generatePreviewToken(): string {
  // Generate a secure random token
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate preview token (basic validation for demo purposes)
 * In production, this should validate against your CMS or database
 */
export function validatePreviewToken(token: string): boolean {
  // Basic validation - token should be 64 characters hex string
  return /^[a-f0-9]{64}$/i.test(token)
}

/**
 * Check if the current request is in preview mode
 */
export async function isPreviewMode(request?: NextRequest): Promise<boolean> {
  if (request) {
    // Check from request headers or cookies
    const previewHeader = request.headers.get(PREVIEW_TOKEN_HEADER)
    const previewCookie = request.cookies.get(PREVIEW_MODE_COOKIE)?.value

    return Boolean(previewHeader || previewCookie === 'true')
  }

  // Server-side check using Next.js cookies
  try {
    const cookieStore = await cookies()
    const previewMode = cookieStore.get(PREVIEW_MODE_COOKIE)?.value
    return previewMode === 'true'
  } catch {
    return false
  }
}

/**
 * Get preview token from request
 */
export async function getPreviewToken(request?: NextRequest): Promise<string | null> {
  if (request) {
    // Check from request headers first, then cookies
    const headerToken = request.headers.get(PREVIEW_TOKEN_HEADER)
    if (headerToken) return headerToken

    const cookieToken = request.cookies.get(PREVIEW_TOKEN_COOKIE)?.value
    return cookieToken || null
  }

  // Server-side check using Next.js cookies
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(PREVIEW_TOKEN_COOKIE)?.value
    return token || null
  } catch {
    return null
  }
}

/**
 * Enable preview mode (API route handler)
 */
export function enablePreviewMode(token: string): NextResponse {
  if (!validatePreviewToken(token)) {
    return NextResponse.json(
      { error: 'Invalid preview token' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({
    success: true,
    message: 'Preview mode enabled'
  })

  // Set preview mode cookies
  response.cookies.set(PREVIEW_MODE_COOKIE, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  response.cookies.set(PREVIEW_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return response
}

/**
 * Disable preview mode (API route handler)
 */
export function disablePreviewMode(): NextResponse {
  const response = NextResponse.json({
    success: true,
    message: 'Preview mode disabled'
  })

  // Clear preview mode cookies
  response.cookies.delete(PREVIEW_MODE_COOKIE)
  response.cookies.delete(PREVIEW_TOKEN_COOKIE)

  return response
}

/**
 * Preview mode banner component props
 */
export interface PreviewBannerProps {
  onExit?: () => void
  className?: string
}

/**
 * Generate preview URL with token
 */
export function generatePreviewUrl(baseUrl: string, token: string): string {
  const url = new URL(baseUrl)
  url.searchParams.set('preview', 'true')
  url.searchParams.set('token', token)
  return url.toString()
}

/**
 * Extract preview parameters from URL
 */
export function extractPreviewParams(url: string): {
  isPreview: boolean
  token: string | null
} {
  try {
    const urlObj = new URL(url)
    const isPreview = urlObj.searchParams.get('preview') === 'true'
    const token = urlObj.searchParams.get('token')

    return { isPreview, token }
  } catch {
    return { isPreview: false, token: null }
  }
}

/**
 * Middleware helper for preview mode
 */
export function handlePreviewMiddleware(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone()
  const { isPreview, token } = extractPreviewParams(url.toString())

  // If preview mode is requested via URL parameters
  if (isPreview && token) {
    if (validatePreviewToken(token)) {
      // Set preview cookies and redirect to clean URL
      const response = NextResponse.redirect(new URL(url.pathname, url.origin))

      response.cookies.set(PREVIEW_MODE_COOKIE, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })

      response.cookies.set(PREVIEW_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return response
    }
  }

  return null
}