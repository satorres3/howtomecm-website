import { NextRequest } from 'next/server'
import { handlePreviewMiddleware } from './lib/preview'

/**
 * Middleware to handle preview mode functionality
 */
export function middleware(request: NextRequest) {
  // Handle preview mode
  const previewResponse = handlePreviewMiddleware(request)
  if (previewResponse) {
    return previewResponse
  }

  // Continue with normal request processing
  return undefined
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}