'use client'

import { useState, useEffect } from 'react'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * Skip link component for keyboard navigation accessibility
 * Implements WCAG 2.1 guideline 2.4.1 (Bypass Blocks)
 */
export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false)

  const baseClasses = `
    fixed top-2 left-2 z-50 px-4 py-2
    bg-blue-600 text-white text-sm font-medium
    rounded shadow-lg transition-transform duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
  `

  const handleFocus = () => setIsVisible(true)
  const handleBlur = () => setIsVisible(false)

  return (
    <a
      href={href}
      className={`${baseClasses} ${className}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={(e) => {
        // Smooth scroll to target
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          // Focus the target element if it's focusable
          if (target instanceof HTMLElement && target.tabIndex >= 0) {
            target.focus()
          }
        }
        setIsVisible(false)
      }}
    >
      {children}
    </a>
  )
}

/**
 * Skip navigation component with multiple skip links
 */
export function SkipNavigation() {
  return (
    <nav aria-label="Skip navigation links" className="sr-only focus-within:not-sr-only">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation" className="ml-2">Skip to navigation</SkipLink>
      <SkipLink href="#footer" className="ml-2">Skip to footer</SkipLink>
    </nav>
  )
}

export default SkipLink