'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * Provides a consistent fade animation between route changes without relying on heavy animation libraries.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
