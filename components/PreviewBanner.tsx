'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PreviewBannerProps {
  onExit?: () => void
  className?: string
}

/**
 * Preview mode banner that shows when viewing unpublished content
 */
export default function PreviewBanner({ onExit, className = '' }: PreviewBannerProps) {
  const [isExiting, setIsExiting] = useState(false)
  const router = useRouter()

  const handleExit = async () => {
    setIsExiting(true)

    try {
      // Call the exit preview API
      const response = await fetch('/api/preview/exit', {
        method: 'POST',
      })

      if (response.ok) {
        if (onExit) {
          onExit()
        } else {
          // Refresh the page to exit preview mode
          router.refresh()
        }
      } else {
        console.error('Failed to exit preview mode')
      }
    } catch (error) {
      console.error('Error exiting preview mode:', error)
    } finally {
      setIsExiting(false)
    }
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`} data-preview-banner>
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Preview mode indicator */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {/* Animated preview icon */}
                <div className="relative">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="font-semibold text-sm md:text-base">
                  Preview Mode
                </span>
              </div>

              <div className="hidden md:block">
                <span className="text-sm opacity-90">
                  You are viewing unpublished content from the CMS
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile-friendly text */}
              <span className="text-xs md:hidden opacity-90">
                Previewing
              </span>

              {/* Exit button */}
              <button
                onClick={handleExit}
                disabled={isExiting}
                className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-sm rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200"
              >
                {isExiting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Exiting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="hidden sm:inline">Exit Preview</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile description */}
          <div className="md:hidden mt-2">
            <p className="text-xs opacity-90">
              You are viewing unpublished content from the CMS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}