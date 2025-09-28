'use client'

import { ReactNode, useRef, useEffect } from 'react'

interface FocusScopeProps {
  children: ReactNode
  contain?: boolean
  restoreFocus?: boolean
  autoFocus?: boolean
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Simplified focus management component
 * Basic WCAG 2.1 focus patterns without external dependencies
 */
export function FocusScope({
  children,
  contain = true,
  restoreFocus = true,
  autoFocus = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: FocusScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  // Store last focused element before entering scope
  useEffect(() => {
    if (contain && restoreFocus) {
      lastFocusedElement.current = document.activeElement as HTMLElement
    }
  }, [contain, restoreFocus])

  // Auto-focus first element if requested
  useEffect(() => {
    if (autoFocus && scopeRef.current) {
      const firstFocusable = scopeRef.current.querySelector<HTMLElement>(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      )
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }
  }, [autoFocus])

  // Restore focus when component unmounts
  useEffect(() => {
    return () => {
      if (restoreFocus && lastFocusedElement.current) {
        lastFocusedElement.current.focus()
      }
    }
  }, [restoreFocus])

  // Handle escape key to exit focus scope
  useEffect(() => {
    if (!contain) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && scopeRef.current?.contains(event.target as Node)) {
        // Let parent components handle escape key
        event.stopPropagation()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [contain])

  return (
    <div
      ref={scopeRef}
      className={className}
      role={contain ? 'region' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={contain ? -1 : undefined}
    >
      {children}
    </div>
  )
}

export default FocusScope
