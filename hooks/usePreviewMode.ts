'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect preview mode on the client side
 */
export function usePreviewMode() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we're in preview mode by looking for preview indicators
    const checkPreviewMode = () => {
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const hasPreviewParam = urlParams.get('preview') === 'true'

      // Check for preview banner in DOM (more reliable)
      const hasPreviewBanner = document.querySelector('[data-preview-banner]') !== null

      // Check for preview mode indicators in the page
      const hasPreviewIndicators =
        hasPreviewParam ||
        hasPreviewBanner ||
        document.body.classList.contains('preview-mode')

      setIsPreviewMode(hasPreviewIndicators)
      setIsLoading(false)
    }

    // Initial check
    checkPreviewMode()

    // Listen for URL changes (in case of client-side navigation)
    const handleUrlChange = () => {
      setTimeout(checkPreviewMode, 100) // Small delay to ensure DOM updates
    }

    window.addEventListener('popstate', handleUrlChange)

    // Listen for DOM changes that might indicate preview mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          checkPreviewMode()
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-preview']
    })

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      observer.disconnect()
    }
  }, [])

  const exitPreviewMode = async () => {
    try {
      const response = await fetch('/api/preview/exit', {
        method: 'POST',
      })

      if (response.ok) {
        // Reload the page to exit preview mode
        window.location.reload()
      } else {
        console.error('Failed to exit preview mode')
      }
    } catch (error) {
      console.error('Error exiting preview mode:', error)
    }
  }

  return {
    isPreviewMode,
    isLoading,
    exitPreviewMode,
  }
}