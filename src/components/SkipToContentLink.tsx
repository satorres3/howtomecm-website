'use client'

import { useEffect, useRef } from 'react'

interface SkipToContentLinkProps {
  targetId?: string
  className?: string
}

/**
 * Accessible skip link allowing keyboard users to bypass repeated navigation.
 */
export default function SkipToContentLink({
  targetId = 'main-content',
  className = ''
}: SkipToContentLinkProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.activeElement === linkRef.current) {
        linkRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <a
      ref={linkRef}
      href={`#${targetId}`}
      className={`skip-to-content ${className}`.trim()}
    >
      Skip to main content
    </a>
  )
}
