'use client'

import { useState, useEffect } from 'react'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  tocItems: TOCItem[]
  className?: string
}

export default function TableOfContents({ tocItems, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(tocItems.length > 0)
  }, [tocItems])

  useEffect(() => {
    const handleScroll = () => {
      // Calculate reading progress based on main article content only
      const articleElement = document.querySelector('article.prose')
      if (articleElement) {
        const articleRect = articleElement.getBoundingClientRect()
        const articleTop = articleElement.offsetTop
        const articleHeight = articleElement.offsetHeight
        const viewportHeight = window.innerHeight
        const currentScroll = window.pageYOffset

        // Calculate progress through the article
        const articleStart = articleTop
        const articleEnd = articleTop + articleHeight - viewportHeight

        if (currentScroll < articleStart) {
          setReadingProgress(0)
        } else if (currentScroll > articleEnd) {
          setReadingProgress(100)
        } else {
          const progress = ((currentScroll - articleStart) / (articleEnd - articleStart)) * 100
          setReadingProgress(Math.min(100, Math.max(0, progress)))
        }
      } else {
        // Fallback to document-based calculation if article not found
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = (winScroll / height) * 100
        setReadingProgress(scrolled)
      }

      // Find active heading
      const headingElements = tocItems.map(item => document.getElementById(item.id)).filter(Boolean)

      let current = ''
      for (const element of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            current = element.id
          }
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Table of Contents */}
      <div className={`sticky top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Table of Contents
        </h3>

        <nav className="space-y-1">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200
                ${item.level === 1 ? 'font-semibold' : 'font-medium'}
                ${item.level === 2 ? 'ml-2' : ''}
                ${item.level === 3 ? 'ml-4' : ''}
                ${item.level === 4 ? 'ml-6' : ''}
                ${item.level === 5 ? 'ml-8' : ''}
                ${item.level === 6 ? 'ml-10' : ''}
                ${activeId === item.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-l-4 border-blue-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {item.title}
            </button>
          ))}
        </nav>

        {/* Reading Progress */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Reading Progress</span>
            <span>{Math.round(readingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>
      </div>
    </>
  )
}