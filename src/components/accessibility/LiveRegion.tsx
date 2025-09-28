'use client'

import { useEffect, useRef, createContext, useContext, ReactNode } from 'react'

type LiveRegionType = 'polite' | 'assertive'

interface LiveRegionContextType {
  announce: (message: string, priority?: LiveRegionType) => void
  clear: () => void
}

const LiveRegionContext = createContext<LiveRegionContextType | null>(null)

/**
 * Hook to access live region functionality
 */
export function useLiveRegion() {
  const context = useContext(LiveRegionContext)
  if (!context) {
    throw new Error('useLiveRegion must be used within a LiveRegionProvider')
  }
  return context
}

interface LiveRegionProviderProps {
  children: ReactNode
}

/**
 * Provider component for managing screen reader announcements
 * Implements WCAG 2.1 live regions for dynamic content updates
 */
export function LiveRegionProvider({ children }: LiveRegionProviderProps) {
  const politeRef = useRef<HTMLDivElement>(null)
  const assertiveRef = useRef<HTMLDivElement>(null)

  const announce = (message: string, priority: LiveRegionType = 'polite') => {
    const targetRef = priority === 'assertive' ? assertiveRef : politeRef

    if (targetRef.current) {
      // Clear existing content first
      targetRef.current.textContent = ''

      // Use a timeout to ensure screen readers notice the change
      setTimeout(() => {
        if (targetRef.current) {
          targetRef.current.textContent = message
        }
      }, 100)

      // Auto-clear after announcement
      setTimeout(() => {
        if (targetRef.current) {
          targetRef.current.textContent = ''
        }
      }, 5000)
    }
  }

  const clear = () => {
    if (politeRef.current) politeRef.current.textContent = ''
    if (assertiveRef.current) assertiveRef.current.textContent = ''
  }

  return (
    <LiveRegionContext.Provider value={{ announce, clear }}>
      {children}
      {/* Live regions for screen reader announcements */}
      <div
        ref={politeRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
        aria-label="Polite announcements"
      />
      <div
        ref={assertiveRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
        aria-label="Important announcements"
      />
    </LiveRegionContext.Provider>
  )
}

interface LiveRegionProps {
  message: string
  priority?: LiveRegionType
  className?: string
}

/**
 * Component for direct live region announcements
 */
export function LiveRegion({ message, priority = 'polite', className }: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (regionRef.current && message) {
      regionRef.current.textContent = message
    }
  }, [message])

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      aria-atomic="true"
      className={`sr-only ${className || ''}`}
      role={priority === 'assertive' ? 'alert' : 'status'}
    >
      {message}
    </div>
  )
}

export default LiveRegionProvider
