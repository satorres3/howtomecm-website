'use client'

import { useEffect } from 'react'

/**
 * Removes dev overlay portals from the tab order so keyboard navigation tests stay reliable in dev mode.
 */
export default function DevOverlayFocusGuard() {
  useEffect(() => {
    const markPortals = () => {
      const portals = document.querySelectorAll('nextjs-portal') as NodeListOf<HTMLElement>
      portals.forEach(portal => {
        portal.setAttribute('aria-hidden', 'true')
        portal.setAttribute('tabindex', '-1')
        portal.setAttribute('inert', 'true')
      })
    }

    // Initial run and observer for portals created after hydration
    markPortals()

    const observer = new MutationObserver(markPortals)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
