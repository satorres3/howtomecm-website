import { SWRConfiguration } from 'swr'
import { sanitizeUrl } from './sanitize'

// Default fetcher function with error handling
export const fetcher = async (url: string) => {
  // Sanitize URL for security
  const sanitizedUrl = sanitizeUrl(url)
  if (!sanitizedUrl) {
    throw new Error('Invalid URL provided to fetcher')
  }

  const response = await fetch(sanitizedUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    // Use Next.js caching by default
    cache: 'force-cache',
    next: { revalidate: 3600 }, // Revalidate every hour
  })

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`)
    // Add more context to the error
    ;(error as any).status = response.status
    ;(error as any).info = await response.text()
    throw error
  }

  return response.json()
}

// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  // Cache data for 5 minutes by default
  dedupingInterval: 300000,
  // Revalidate when window gets focused
  revalidateOnFocus: true,
  // Revalidate when reconnecting
  revalidateOnReconnect: true,
  // Don't revalidate on mount if data exists and is less than 5 minutes old
  revalidateIfStale: false,
  // Retry on error
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  // Loading timeout
  loadingTimeout: 10000,
  // Focus revalidation timeout
  focusThrottleInterval: 5000,
  // Global error handler
  onError: (error, key) => {
    console.error('SWR Error:', { error, key })
    // You can integrate with error tracking service here
    // e.g., Sentry.captureException(error, { tags: { swrKey: key } })
  },
  // Global success handler for debugging
  onSuccess: (data, key) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SWR Success:', { key, dataLength: JSON.stringify(data).length })
    }
  },
}