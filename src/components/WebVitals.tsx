'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric)
    }

    // In production, you would send this to your analytics service
    // Examples:
    // - Google Analytics 4
    // - Vercel Analytics
    // - Custom analytics endpoint

    // Example for Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Example for custom analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          label: metric.label,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(error => {
        // Silently fail to avoid impacting user experience
        console.debug('Failed to send web vital:', error)
      })
    }
  })

  // This component doesn't render anything
  return null
}

// Type declaration for gtag (if using Google Analytics)
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParameters: {
        value: number
        event_category: string
        event_label: string
        non_interaction: boolean
      }
    ) => void
  }
}