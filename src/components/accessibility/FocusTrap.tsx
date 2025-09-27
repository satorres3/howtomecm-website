'use client'

import { ReactNode, useRef, useEffect, KeyboardEvent } from 'react'

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  onEscape?: () => void
  restoreFocus?: boolean
  className?: string
}

/**
 * Simple focus trap component for modals and overlays
 * Basic WCAG 2.1 focus management without heavy dependencies
 */
export function FocusTrap({
  children,
  active = true,
  onEscape,
  restoreFocus = true,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  // Store the last focused element when trap becomes active
  useEffect(() => {
    if (active && restoreFocus) {
      lastFocusedElement.current = document.activeElement as HTMLElement
    }
  }, [active, restoreFocus])

  // Restore focus when trap becomes inactive
  useEffect(() => {
    return () => {
      if (restoreFocus && lastFocusedElement.current) {
        lastFocusedElement.current.focus()
      }
    }
  }, [restoreFocus])

  // Handle keyboard navigation within the trap
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!active) return

    if (event.key === 'Escape') {
      event.preventDefault()
      onEscape?.()
      return
    }

    if (event.key === 'Tab' && containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current)
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const currentElement = document.activeElement

      if (event.shiftKey) {
        // Shift + Tab - move to previous element
        if (currentElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab - move to next element
        if (currentElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }
  }

  // Auto-focus first element when trap becomes active
  useEffect(() => {
    if (active && containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current)
      const firstElement = focusableElements[0]
      if (firstElement) {
        setTimeout(() => firstElement.focus(), 0)
      }
    }
  }, [active])

  if (!active) {
    return <div className={className}>{children}</div>
  }

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  return (
    <div
      ref={containerRef}
      className={className}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Focus trapped region"
      tabIndex={-1}
    >
      {children}
    </div>
  )
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  )

  return elements.filter(element => {
    // Check if element is visible and not hidden
    const style = getComputedStyle(element)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      !element.hasAttribute('hidden') &&
      element.offsetParent !== null
    )
  })
}

export default FocusTrap