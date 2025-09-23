'use client'

import { useEffect } from 'react'

interface StructuredDataProps {
  data: Record<string, any>
}

/**
 * Component to inject structured data (JSON-LD) into the page head
 */
export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create and inject structured data script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    script.id = 'structured-data'

    // Remove existing structured data if present
    const existingScript = document.getElementById('structured-data')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const currentScript = document.getElementById('structured-data')
      if (currentScript) {
        currentScript.remove()
      }
    }
  }, [data])

  // This component doesn't render anything visible
  return null
}