'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '../../../types/content'
import CommentSection from './CommentSection'
import TagList from './TagList'
import { sanitizeHtml } from '@/lib/sanitize'

interface BlogPostContentProps {
  post: Post
  relatedPosts: Post[]
}

interface HeadingItem {
  id: string
  text: string
  level: number
}

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@howtomecm?sub_confirmation=1'

// Function to add IDs to headings in HTML content
function addHeadingIdsToHTML(htmlContent: string): { processedHTML: string, headings: HeadingItem[] } {
  // Check if we're on the client side where DOMParser is available
  if (typeof window === 'undefined') {
    // Server-side: return original content and empty headings
    return { processedHTML: htmlContent, headings: [] }
  }

  const headings: HeadingItem[] = []

  // Create a temporary DOM parser to work with the HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')

  // Find all headings in the content
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

  headingElements.forEach((heading, index) => {
    const text = heading.textContent?.trim() || ''
    if (!text) return

    // Generate ID from text content
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

    // Ensure unique IDs
    const uniqueId = headings.some(h => h.id === id) ? `${id}-${index}` : id

    // Add ID to the heading element
    heading.setAttribute('id', uniqueId)

    // Store heading info
    headings.push({
      id: uniqueId,
      text,
      level: parseInt(heading.tagName.charAt(1))
    })
  })

  // Return the processed HTML and extracted headings
  return {
    processedHTML: doc.body.innerHTML,
    headings
  }
}

function enhanceContentStructure(article: HTMLElement) {
  // Enhanced patterns detection
  const strongElements = Array.from(article.querySelectorAll('p > strong:first-child'))

  strongElements.forEach(strongElement => {
    const paragraph = strongElement.parentElement as HTMLParagraphElement
    const strongText = strongElement.textContent?.trim() || ''

    // Detect different types of content blocks
    if (strongText.includes('Why is') && strongText.includes('Must-Have')) {
      createCalloutBox(paragraph, 'info', 'Key Benefits', 'info')
    } else if (strongText.includes('Configuring') || strongText.includes('Step-by-Step')) {
      createTopicSection(paragraph, strongText)
    } else if (strongText.includes('What Happens After')) {
      createSummaryBox(paragraph, 'Implementation Results')
    }
  })

  // Convert numbered lists to enhanced step lists
  const orderedLists = Array.from(article.querySelectorAll('ol'))
  orderedLists.forEach(ol => {
    if (ol.children.length > 2) { // Only enhance substantial lists
      ol.classList.add('step-list')
    }
  })
}

function createCalloutBox(paragraph: HTMLParagraphElement, type: string, title: string, iconType: string) {
  const calloutBox = document.createElement('div')
  calloutBox.className = `callout-box callout-box--${type}`

  const icon = getCalloutIcon(iconType)

  calloutBox.innerHTML = `
    <div class="callout-box__header">
      <div class="callout-box__icon">${icon}</div>
      <span>${title}</span>
    </div>
    <div class="callout-box__content">
      ${paragraph.innerHTML}
    </div>
  `

  paragraph.parentNode?.replaceChild(calloutBox, paragraph)
}

function createTopicSection(paragraph: HTMLParagraphElement, title: string) {
  const topicSection = document.createElement('div')
  topicSection.className = 'topic-section'

  // Extract number from title if present
  const numberMatch = title.match(/(\d+)/)
  const number = numberMatch ? numberMatch[1] : '1'

  topicSection.innerHTML = `
    <div class="topic-section__header">
      <div class="topic-section__number">${number}</div>
      <h3 class="topic-section__title">${title.replace(/^\d+\.\s*/, '')}</h3>
    </div>
    <div class="topic-section__content">
      ${paragraph.innerHTML}
    </div>
  `

  paragraph.parentNode?.replaceChild(topicSection, paragraph)
}

function createSummaryBox(paragraph: HTMLParagraphElement, title: string) {
  const summaryBox = document.createElement('div')
  summaryBox.className = 'summary-box'

  summaryBox.innerHTML = `
    <h4>${title}</h4>
    ${paragraph.innerHTML}
  `

  paragraph.parentNode?.replaceChild(summaryBox, paragraph)
}

function getCalloutIcon(type: string): string {
  const icons = {
    info: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    tip: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    important: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
  }
  return icons[type as keyof typeof icons] || icons.info
}

function formatMetric(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—'
  }

  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value)
  }

  return new Intl.NumberFormat('en-US').format(value)
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}



function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return date
  }
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const articleRef = useRef<HTMLDivElement | null>(null)
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [shareUrl, setShareUrl] = useState<string>('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const [likeStatus, setLikeStatus] = useState<'idle' | 'liked'>('idle')
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [contentEnhanced, setContentEnhanced] = useState(false)

  // State for processed HTML to avoid hydration mismatch
  const [processedHTML, setProcessedHTML] = useState(post.content || '')
  const [extractedHeadings, setExtractedHeadings] = useState<HeadingItem[]>([])
  const [showFloatingTOC, setShowFloatingTOC] = useState(false)
  const [floatingTOCOpen, setFloatingTOCOpen] = useState(false)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<string>('')
  const [focusedSection, setFocusedSection] = useState<string>('')
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  const totalHeadings = headings.length
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)))
  const activeHeadingIndex = useMemo(() => {
    if (!totalHeadings) return -1
    return headings.findIndex(heading => heading.id === activeHeading)
  }, [activeHeading, headings, totalHeadings])

  const engagementMetrics = useMemo(
    () => [
      { label: 'Total views', value: typeof post.view_count === 'number' ? post.view_count : null },
      { label: 'Shares', value: typeof post.share_count === 'number' ? post.share_count : null },
      { label: 'Likes', value: typeof post.like_count === 'number' ? post.like_count : null }
    ],
    [post.like_count, post.share_count, post.view_count]
  )

  const hasEngagementMetrics = engagementMetrics.some(metric => metric.value !== null)

  const authorName = post.author?.full_name || 'How to MeCM Team'
  const authorAvatar = post.author?.avatar_url || '/images/authors/saulo-alves.svg'
  const authorRole = (post.author as any)?.role
  const authorBio = (post.author as any)?.bio

  const readingTimeLabel = useMemo(() => {
    if (post.reading_time && post.reading_time > 0) {
      return `${post.reading_time} min read`
    }

    const words = post.content ? post.content.split(/\s+/).length : 0
    const averageWordsPerMinute = 200
    const estimate = Math.ceil(words / averageWordsPerMinute)
    return estimate ? `${estimate} min read` : null
  }, [post.content, post.reading_time])

  // Client-side initialization - ensure hydration complete
  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      setIsClient(true)
      if (typeof window !== 'undefined') {
        // Use production URL for sharing instead of localhost
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        if (isLocalhost && post?.slug) {
          const productionUrl = `https://howtomecm.com/blog/${post.slug}`
          setShareUrl(productionUrl)
        } else {
          setShareUrl(window.location.href)
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [post?.slug])


  // Process HTML content on client side to avoid hydration mismatch
  useEffect(() => {
    if (!isClient || !post.content) return

    // First sanitize the HTML content for security
    const sanitizedContent = sanitizeHtml(post.content, 'blog')

    // Then process for heading IDs and TOC
    const result = addHeadingIdsToHTML(sanitizedContent)
    setProcessedHTML(result.processedHTML)
    setExtractedHeadings(result.headings)
    setHeadings(result.headings)
  }, [isClient, post.content])

  useEffect(() => {
    if (!isClient || contentEnhanced || typeof window === 'undefined') return

    const article = articleRef.current
    if (!article) return

    // Add additional delay to ensure DOM is stable after hydration
    const timer = setTimeout(() => {
      // Clean up old embed elements first
      Array.from(article.querySelectorAll('.video-embed-cta, .video-embed-wrapper')).forEach(element => {
        element.remove()
      })

    // Handle video-embed-frame elements specifically
    Array.from(article.querySelectorAll('.video-embed-frame')).forEach(frameElement => {
      const iframe = frameElement.querySelector<HTMLIFrameElement>('iframe[src*="youtube.com/embed/"]')
      if (iframe && !iframe.dataset.enhanced) {
        // Extract iframe from the frame and enhance it
        frameElement.parentNode?.insertBefore(iframe, frameElement)
        frameElement.remove()
      }
    })

    // Enhanced YouTube embed handling
    const embeds = Array.from(
      article.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed/"]:not([data-enhanced="true"])')
    )

    embeds.forEach(iframe => {
      const src = iframe.getAttribute('src') || ''
      const videoIdMatch = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/)
      const videoId = videoIdMatch ? videoIdMatch[1] : ''

      // Extract video title from iframe title attribute or use default
      const videoTitle = iframe.getAttribute('title') || 'How to MeCM Tutorial'

      // Create professional wrapper
      const wrapper = document.createElement('div')
      wrapper.className = 'video-embed-professional'

      // Create header section
      const header = document.createElement('div')
      header.className = 'video-embed-header'
      header.innerHTML = `
        <div class="video-embed-header-main">
          <h3 class="video-embed-title">${videoTitle}</h3>
          <div class="video-embed-channel">
            <a href="${YOUTUBE_CHANNEL_URL}"
               target="_blank"
               rel="noopener noreferrer"
               class="video-embed-channel-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              How to MeCM
            </a>
          </div>
          <div class="video-embed-meta">
            <div class="video-embed-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Professional Tutorial
            </div>
            <div class="video-embed-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Step-by-step Guide
            </div>
            <div class="video-embed-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.72-2.97-.01-2.03-1.74-2.7-3.65-3.22z"/>
              </svg>
              ~15 min watch
            </div>
          </div>
          <p class="video-embed-subtitle">Follow along and catch the next field note on YouTube.</p>
        </div>
        <div class="video-embed-chapters">
          <h4 class="video-chapters-title">Video Chapters</h4>
          <div class="video-chapters-list">
            <button class="video-chapter-item active" data-time="0">
              <div class="chapter-marker">1</div>
              <div class="chapter-info">
                <span class="chapter-title">Introduction & Overview</span>
                <span class="chapter-time">0:00</span>
              </div>
            </button>
            <button class="video-chapter-item" data-time="180">
              <div class="chapter-marker">2</div>
              <div class="chapter-info">
                <span class="chapter-title">Core Configuration</span>
                <span class="chapter-time">3:00</span>
              </div>
            </button>
            <button class="video-chapter-item" data-time="480">
              <div class="chapter-marker">3</div>
              <div class="chapter-info">
                <span class="chapter-title">Testing & Validation</span>
                <span class="chapter-time">8:00</span>
              </div>
            </button>
            <button class="video-chapter-item" data-time="720">
              <div class="chapter-marker">4</div>
              <div class="chapter-info">
                <span class="chapter-title">Troubleshooting Tips</span>
                <span class="chapter-time">12:00</span>
              </div>
            </button>
          </div>
        </div>
      `

      // Create video player section
      const player = document.createElement('div')
      player.className = 'video-embed-player'

      // Style the iframe
      iframe.className = ''
      iframe.setAttribute('loading', 'lazy')
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
      iframe.setAttribute('allowfullscreen', 'true')
      iframe.dataset.enhanced = 'true'

      // Create actions section
      const actions = document.createElement('div')
      actions.className = 'video-embed-actions'
      actions.innerHTML = `
        <div class="video-embed-buttons">
          <a href="${YOUTUBE_CHANNEL_URL}"
             target="_blank"
             rel="noopener noreferrer"
             class="video-embed-button video-embed-button--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe
          </a>
          ${videoId ? `
            <a href="https://www.youtube.com/watch?v=${videoId}&feature=like"
               target="_blank"
               rel="noopener noreferrer"
               class="video-embed-button video-embed-button--secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
              </svg>
              Like video
            </a>
          ` : ''}
          <button class="video-embed-button video-embed-button--secondary video-transcript-toggle" onclick="toggleTranscript('${videoId}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Show Transcript
          </button>
        </div>
        <div class="video-embed-secondary-actions">
          <button class="video-embed-button video-embed-button--ghost" onclick="copyVideoUrl('${videoId}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy Link
          </button>
          <button class="video-embed-button video-embed-button--ghost" onclick="shareVideo('${videoTitle}', '${videoId}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
            Share
          </button>
        </div>
      `

      // Insert elements
      iframe.parentNode?.insertBefore(wrapper, iframe)
      wrapper.appendChild(header)
      wrapper.appendChild(player)
      player.appendChild(iframe)
      wrapper.appendChild(actions)
    })

      setContentEnhanced(true)
    }, 200) // Delay DOM manipulation

    return () => clearTimeout(timer)
  }, [post.content, isClient, contentEnhanced])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return

    const article = articleRef.current
    if (!article) return

    const codeBlocks = Array.from(article.querySelectorAll('pre'))

    codeBlocks.forEach(pre => {
      if (pre.dataset.copyEnhanced === 'true') return

      pre.dataset.copyEnhanced = 'true'
      pre.classList.add('code-block__content')

      const existingWrapper = pre.parentElement?.classList.contains('code-block-wrapper')
        ? (pre.parentElement as HTMLDivElement)
        : null

      let wrapper: HTMLDivElement
      if (existingWrapper) {
        wrapper = existingWrapper
      } else {
        wrapper = document.createElement('div')
        wrapper.className = 'code-block-wrapper relative rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden my-6 shadow-sm'
        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(pre)
      }

      // Enhanced pre styling
      pre.className = 'code-block__content m-0 p-6 bg-transparent text-sm leading-relaxed overflow-x-auto font-mono'

      if (wrapper.querySelector('[data-copy-control="true"]')) return

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-copy-trigger absolute top-3 right-3 inline-flex items-center gap-2 rounded-lg border border-gray-300/50 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-white hover:border-gray-400 hover:text-gray-700 dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500 dark:hover:text-gray-200'
      button.setAttribute('data-copy-control', 'true')
      button.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        <span class="code-copy-trigger__label">Copy</span>
      `

      button.addEventListener('click', async () => {
        try {
          const text = pre.textContent || ''
          await navigator.clipboard.writeText(text)
          button.classList.add('is-copied')
          const label = button.querySelector('.code-copy-trigger__label')
          if (label) {
            label.textContent = 'Copied!'
          }
          setTimeout(() => {
            button.classList.remove('is-copied')
            if (label) {
              label.textContent = 'Copy'
            }
          }, 2000)
        } catch (error) {
          button.classList.add('is-error')
          const label = button.querySelector('.code-copy-trigger__label')
          if (label) {
            label.textContent = 'Try again'
          }
          setTimeout(() => {
            button.classList.remove('is-error')
            if (label) {
              label.textContent = 'Copy'
            }
          }, 2000)
        }
      })

      wrapper.appendChild(button)
    })

    // Enhance content with callout boxes and topic organization
    enhanceContentStructure(article)
  }, [post.content, isClient])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return

    const article = articleRef.current
    if (!article) return

    const anchorCandidates = Array.from(article.querySelectorAll('p > a')) as HTMLAnchorElement[]

    const redundant = Array.from(article.querySelectorAll('h2, h3, h4, p')) as HTMLElement[]
    redundant.forEach(node => {
      if (!node.textContent) return
      const normalized = node.textContent.trim().toLowerCase()
      if (!normalized) return
      if (/(subscribe to our newsletter|stay in the loop|join our newsletter)/i.test(normalized)) {
        node.remove()
      }
    })

    anchorCandidates.forEach(anchor => {
      if (anchor.dataset.ctaEnhanced === 'true') return

      const parent = anchor.parentElement
      if (!parent) return

      const hasOnlyAnchor = parent.childNodes.length === 1
      if (!hasOnlyAnchor) return

      const label = anchor.textContent?.trim()
      if (!label) return

      anchor.dataset.ctaEnhanced = 'true'
      parent.classList.add('prose-cta-wrapper')
      anchor.classList.add('prose-cta-button')
      anchor.setAttribute('role', 'button')
    })
  }, [post.content, isClient])


  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const updateProgress = () => {
      const rect = article.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      const totalScrollable = Math.max(rect.height - windowHeight, 1)
      const offset = Math.max(window.scrollY - (article.offsetTop - 32), 0)
      const value = Math.min(offset / totalScrollable, 1)
      const progressPercent = Number((value * 100).toFixed(2))
      setProgress(progressPercent)

      // Calculate estimated time remaining
      if (post.reading_time && progressPercent > 0) {
        const remainingPercent = Math.max(100 - progressPercent, 0)
        const timeRemaining = Math.ceil((post.reading_time * remainingPercent) / 100)
        setEstimatedTimeRemaining(timeRemaining > 1 ? `${timeRemaining} min left` : 'Almost done!')
      }

      // Show/hide floating TOC based on scroll position
      const showFloating = window.scrollY > 800 && progressPercent < 90
      setShowFloatingTOC(showFloating)

      if (!headings.length) return
      let current = headings[0]?.id || ''

      // CRITICAL FIX: Use article-scoped search for scroll tracking
      const articleElement = articleRef.current
      if (!articleElement) return

      for (const heading of headings) {
        const element = articleElement.querySelector(`#${heading.id}`)
        if (!element) continue
        const elementTop = element.getBoundingClientRect().top + window.scrollY - 144
        if (window.scrollY >= elementTop) {
          current = heading.id
        }
      }
      setActiveHeading(current)
    }

    updateProgress()
    const events: Array<[keyof WindowEventMap, EventListenerOrEventListenerObject]> = [
      ['scroll', updateProgress],
      ['resize', updateProgress]
    ]
    events.forEach(([event, handler]) => window.addEventListener(event, handler, { passive: true }))

    return () => {
      events.forEach(([event, handler]) => window.removeEventListener(event, handler))
    }
  }, [headings, post.reading_time])

  // Keyboard navigation support
  useEffect(() => {
    if (!isClient) return

    const handleKeydown = (event: KeyboardEvent) => {
      // Only handle shortcuts when no input is focused
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) return

      switch (event.key) {
        case 'j':
        case 'ArrowDown':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            const currentIndex = headings.findIndex(h => h.id === activeHeading)
            const nextIndex = Math.min(currentIndex + 1, headings.length - 1)
            if (nextIndex >= 0 && headings[nextIndex]) {
              const articleElement = articleRef.current
              const target = articleElement?.querySelector(`#${headings[nextIndex].id}`)
              if (target) {
                const offset = 96
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset
                window.scrollTo({ top: targetPosition, behavior: 'smooth' })
              }
            }
          }
          break
        case 'k':
        case 'ArrowUp':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            const currentIndex = headings.findIndex(h => h.id === activeHeading)
            const prevIndex = Math.max(currentIndex - 1, 0)
            if (prevIndex >= 0 && headings[prevIndex]) {
              const articleElement = articleRef.current
              const target = articleElement?.querySelector(`#${headings[prevIndex].id}`)
              if (target) {
                const offset = 96
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset
                window.scrollTo({ top: targetPosition, behavior: 'smooth' })
              }
            }
          }
          break
        case 't':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            setFloatingTOCOpen(prev => !prev)
          }
          break
        case 'Escape':
          setFloatingTOCOpen(false)
          setShowKeyboardHelp(false)
          break
        case '?':
          if (!event.shiftKey) return
          event.preventDefault()
          setShowKeyboardHelp(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [isClient, headings, activeHeading])

  // Shared scroll function for better consistency with useCallback for stable reference
  const scrollToHeading = useCallback((headingId: string, event?: React.MouseEvent, source?: string) => {
    if (!isClient || typeof window === 'undefined') {
      return
    }

    // Prevent default anchor behavior
    event?.preventDefault()

    // Find target element by ID (IDs are now in the HTML directly)
    const target = document.getElementById(headingId)

    if (target) {
      const offset = 96
      const targetRect = target.getBoundingClientRect()
      const targetPosition = targetRect.top + window.scrollY - offset

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })

      // Update URL hash
      window.history.replaceState(null, '', `#${headingId}`)
      console.log(`✅ Scrolled to ${headingId}`)
    } else {
      console.log(`❌ Target element not found: ${headingId}`)
    }
  }, [isClient])

  const containerClasses = `mt-10 grid gap-8 transition-all duration-500 ease-in-out lg:grid-cols-[auto_1fr] lg:items-start ${
    isSidebarCollapsed ? 'lg:grid-cols-1 lg:gap-0' : 'lg:gap-12'
  }`
  const articleWidthClass = isSidebarCollapsed
    ? 'lg:max-w-none xl:max-w-[min(90vw,1400px)] mx-auto transition-all duration-500 ease-in-out'
    : 'lg:max-w-none xl:max-w-[min(65vw,1000px)] transition-all duration-500 ease-in-out'

  // Move hide navigation button to alignment row
  useEffect(() => {
    if (!isClient) return

    const placeholder = document.getElementById('hide-navigation-placeholder')
    const hideNavigationButton = document.getElementById('hide-navigation-button')

    if (placeholder && !hideNavigationButton) {
      // Create the hide navigation button and insert it into the placeholder
      const button = document.createElement('button')
      button.id = 'hide-navigation-button'
      button.type = 'button'
      button.className = 'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:border-blue-300 hover:text-blue-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-200'
      button.setAttribute('aria-expanded', (!isSidebarCollapsed).toString())
      button.setAttribute('aria-controls', 'desktop-post-navigation')

      button.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 ease-in-out ${isSidebarCollapsed ? 'rotate-180' : ''}">
          <path fill="currentColor" d="M9.5 5.5a1 1 0 0 1 1.6-.8l6 5a1 1 0 0 1 0 1.6l-6 5a1 1 0 0 1-1.6-.8V5.5z"/>
        </svg>
        <span class="transition-all duration-300 ease-in-out">
          ${isSidebarCollapsed ? 'Show navigation' : 'Hide navigation'}
        </span>
      `

      button.addEventListener('click', () => {
        setIsSidebarCollapsed(prev => !prev)
      })

      placeholder.appendChild(button)
    }

    // Update button state when isSidebarCollapsed changes
    if (hideNavigationButton) {
      hideNavigationButton.setAttribute('aria-expanded', (!isSidebarCollapsed).toString())
      const svg = hideNavigationButton.querySelector('svg')
      const span = hideNavigationButton.querySelector('span')

      if (svg) {
        svg.setAttribute('class', `h-4 w-4 transition-transform duration-300 ease-in-out ${isSidebarCollapsed ? 'rotate-180' : ''}`)
      }
      if (span) {
        span.textContent = isSidebarCollapsed ? 'Show navigation' : 'Hide navigation'
      }
    }
  }, [isClient, isSidebarCollapsed])

  // Add copy functionality to code blocks
  useEffect(() => {
    if (!isClient || !post.content) return

    const codeBlocks = document.querySelectorAll('pre code')

    codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement
      if (!pre || pre.dataset.copyButtonAdded) return

      // Mark as processed
      pre.dataset.copyButtonAdded = 'true'

      // Create copy button
      const copyButton = document.createElement('button')
      copyButton.className = 'absolute top-3 right-3 flex items-center gap-2 rounded-lg bg-gray-800/80 px-3 py-2 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-gray-700/90 group-hover:opacity-100 focus:opacity-100'
      copyButton.innerHTML = `
        <svg class="copy-icon h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        <span class="copy-text">Copy</span>
      `

      // Add hover class to pre for button visibility
      pre.classList.add('group', 'relative')
      pre.style.position = 'relative'

      // Copy functionality
      copyButton.addEventListener('click', async () => {
        try {
          const code = codeBlock.textContent || ''
          await navigator.clipboard.writeText(code)

          // Update button state
          const icon = copyButton.querySelector('.copy-icon')
          const text = copyButton.querySelector('.copy-text')

          if (icon && text) {
            icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>`
            text.textContent = 'Copied!'
            copyButton.classList.add('bg-green-600/80')

            // Reset after 2 seconds
            setTimeout(() => {
              icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>`
              text.textContent = 'Copy'
              copyButton.classList.remove('bg-green-600/80')
            }, 2000)
          }
        } catch (error) {
          console.error('Copy failed:', error)
        }
      })

      pre.appendChild(copyButton)
    })
  }, [isClient, post.content, processedHTML])

  const desktopSidebar = () => (
    <aside
      id="desktop-post-navigation"
      aria-label="Article navigation and reading progress"
      aria-hidden={isSidebarCollapsed}
      className={`hidden space-y-8 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-md backdrop-blur transition-all duration-500 ease-in-out dark:border-gray-800 dark:bg-gray-900/90 lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:sidebar-scroll ${
        isSidebarCollapsed
          ? 'lg:hidden lg:w-0 lg:min-w-0 lg:opacity-0 lg:scale-95 lg:translate-x-8'
          : 'lg:block lg:w-[320px] lg:min-w-[320px] lg:opacity-100 lg:scale-100 lg:translate-x-0'
      }`}
    >
      <section data-testid="reading-progress" className="relative">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
            Reading Progress
          </h2>
        </div>
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="toc-progress mx-auto">
            <svg viewBox="0 0 120 120" className="toc-progress__svg" aria-hidden="true">
              <circle className="toc-progress__track" cx="60" cy="60" r="52" />
              <circle
                className="toc-progress__indicator"
                cx="60"
                cy="60"
                r="52"
                strokeDasharray={Math.PI * 2 * 52}
                strokeDashoffset={Math.PI * 2 * 52 * (1 - progress / 100)}
              />
            </svg>
            <div className="toc-progress__value">
              <span>{roundedProgress}</span>
              <small>%</small>
            </div>
          </div>

          <div className="w-full space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                </svg>
                <span>{totalHeadings} sections</span>
              </div>
            </div>

            {estimatedTimeRemaining && (
              <div className="flex items-center justify-center rounded-lg bg-blue-50/80 p-2 dark:bg-blue-900/30">
                <div className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-200">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                  </svg>
                  <span>{estimatedTimeRemaining}</span>
                </div>
              </div>
            )}

            {post.category && (
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {post.category.name}
                </span>
              </div>
            )}
          </div>

          {totalHeadings > 0 && (
            <div className="w-full">
              <h3 className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Table of Contents
              </h3>
              <nav className="mx-auto w-full max-w-[280px]" aria-label="Table of contents">
                <ol className="space-y-2">
                  {headings.map((heading, index) => {
                    const isActive = activeHeading === heading.id
                    const isCompleted = activeHeadingIndex !== -1 && index < activeHeadingIndex
                    const isNext = activeHeadingIndex !== -1 && index === activeHeadingIndex + 1

                    return (
                      <li key={heading.id} className="flex justify-center">
                        <a
                          href={`#${heading.id}`}
                          onClick={event => scrollToHeading(heading.id, event, 'main-toc')}
                          className={`group relative flex w-full max-w-[260px] items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-150 ${
                            isActive
                              ? 'border-blue-200 bg-blue-50/80 text-blue-700 shadow-sm dark:border-blue-500/60 dark:bg-blue-500/20 dark:text-blue-100'
                              : isCompleted
                              ? 'border-blue-100/40 bg-blue-50/40 text-gray-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-gray-100'
                              : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                              isActive
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : isCompleted
                                ? 'border-blue-400 bg-blue-400/70 text-white'
                                : isNext
                                ? 'border-blue-300 text-blue-500'
                                : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span
                            className={`flex-1 text-left leading-tight ${
                              heading.level > 2 ? 'text-xs font-medium' : 'text-sm font-medium'
                            }`}
                          >
                            {heading.text}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </nav>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <Link
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 p-4 text-white transition-all duration-200 hover:-translate-y-1 hover:from-red-600 hover:to-red-700 hover:shadow-lg dark:from-red-600 dark:to-red-700"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 15l5.19-3L10 9v6zm11.56-7.83c-.13-.72-.75-1.27-1.48-1.43C18.88 5.3 12 5.3 12 5.3s-6.88 0-8.08.44c-.73.16-1.35.71-1.48 1.43C2.17 8.27 2.17 12 2.17 12s0 3.73.27 5.83c.13.72.75 1.27 1.48 1.43 1.2.44 8.08.44 8.08.44s6.88 0 8.08-.44c.73-.16 1.35-.71 1.48-1.43.27-2.1.27-5.83.27-5.83s0-3.73-.27-5.83z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Watch the walkthrough</p>
            <p className="text-base font-semibold">Subscribe to How to MeCM on YouTube</p>
          </div>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
          Related articles
        </h2>
        <div className="mt-4 space-y-4">
          {relatedPosts.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-300">More field notes are coming shortly.</p>
          )}
          {relatedPosts.slice(0, 4).map(relatedPost => (
            <Link
              key={relatedPost.id}
              href={`/blog/${relatedPost.slug}`}
              className="block rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-blue-500 dark:hover:text-blue-200"
            >
              <span className="block text-xs font-medium uppercase tracking-wide text-blue-500 dark:text-blue-300">
                {formatDate(relatedPost.created_at)}
              </span>
              <span className="mt-1 block text-base">{relatedPost.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  )

  const mainContent = () => (
    <div className="space-y-12 transition-all duration-300 lg:min-w-0">
      <div className="flex justify-end">
        <div id="hide-navigation-placeholder" className="hidden lg:flex" />
      </div>

      <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/95 via-blue-50/30 to-purple-50/30 p-8 shadow-xl backdrop-blur dark:border-gray-700/30 dark:from-gray-900/95 dark:via-blue-900/10 dark:to-purple-900/10 lg:p-12">
        <div className="space-y-8">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {post.category && (
                <span className="inline-flex items-center rounded-full bg-purple-100/80 px-4 py-2 text-purple-700 font-medium dark:bg-purple-900/30 dark:text-purple-200">
                  {post.category.name}
                </span>
              )}
              {post.tags && post.tags.length > 0 && <TagList tags={post.tags} />}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl font-light leading-relaxed text-gray-600 dark:text-gray-300">{post.excerpt}</p>
            )}
          </header>

          <div className="border-t border-gray-200/50 pt-6 dark:border-gray-700/30">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-blue-100 dark:ring-blue-900/50">
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{authorName}</p>
                  {authorRole && (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-300">{authorRole}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">Published {formatDate(post.created_at)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                  </svg>
                  <span>{readingTimeLabel}</span>
                </div>
                {totalHeadings > 0 && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                    </svg>
                    <span>{totalHeadings} sections</span>
                  </div>
                )}
                {post.view_count && post.view_count > 0 && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                    </svg>
                    <span>{post.view_count} views</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {totalHeadings > 0 && (
        <div className="rounded-2xl border border-blue-100/50 bg-white/60 p-6 dark:border-blue-800/30 dark:bg-gray-800/30">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            Article Overview
          </h2>
          <Link
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 block rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-4 transition-all duration-200 hover:from-red-100 hover:to-red-200 hover:border-red-300 dark:border-red-700/50 dark:from-red-900/20 dark:to-red-800/20 dark:hover:from-red-900/30 dark:hover:to-red-800/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Watch Video Tutorial</h3>
                <p className="text-xs text-red-600 dark:text-red-400">Step-by-step walkthrough available on YouTube</p>
              </div>
              <svg className="ml-auto h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </div>
          </Link>
          <div className="grid gap-3 sm:grid-cols-2">
            {headings.map((heading, index) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={event => scrollToHeading(heading.id, event, 'article-overview')}
                className="flex items-center gap-3 rounded-xl border border-gray-200/50 bg-white/40 p-3 transition-all duration-200 hover:border-blue-200/60 hover:bg-blue-50/60 dark:border-gray-600/30 dark:bg-gray-700/20 dark:hover:bg-blue-900/20 dark:hover:border-blue-700/40"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{heading.text}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <article
        ref={articleRef}
        className={`prose prose-lg w-full rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur transition-all duration-300 dark:prose-invert dark:bg-gray-900/90 dark:text-gray-100 lg:p-12 ${articleWidthClass}`}
      >
        {post.content ? (
          <div
            className="prose prose-lg prose-enhanced max-w-none leading-relaxed text-gray-700 dark:text-gray-200 prose-headings:scroll-mt-24 prose-img:rounded-2xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: processedHTML }}
          />
        ) : (
          <p className="text-base text-gray-600 dark:text-gray-300">No content available for this post yet.</p>
        )}
      </article>

      <div className="not-prose rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-gray-900/90">
        <div className="mb-6 flex flex-wrap items-center gap-3" data-testid="share-actions">
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Share</span>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl || `https://howtomecm.com/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt || `Expert insights on ${post.title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-600/20 dark:bg-blue-500/20 dark:text-blue-200 dark:hover:bg-blue-500/30"
          >
            LinkedIn
          </a>
          <button
            type="button"
            onClick={async () => {
              try {
                if (shareUrl) {
                  await navigator.clipboard.writeText(shareUrl)
                  setCopyStatus('copied')
                  setTimeout(() => setCopyStatus('idle'), 2000)
                }
              } catch (error) {
                console.error('Copy failed', error)
              }
            }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
          >
            {copyStatus === 'copied' ? 'Link copied' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (likeStatus === 'idle') {
                setLikeStatus('liked')
                setLikeCount(prev => prev + 1)
              }
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              likeStatus === 'liked'
                ? 'scale-105 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                : 'bg-gray-100/50 text-gray-600 hover:scale-105 hover:bg-red-50/70 hover:text-red-500 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-red-500/10 dark:hover:text-red-400'
            }`}
            disabled={likeStatus === 'liked'}
          >
            <svg
              className={`h-4 w-4 transition-all duration-300 ${likeStatus === 'liked' ? 'animate-pulse' : ''}`}
              fill={likeStatus === 'liked' ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>
              {likeStatus === 'liked' ? 'Liked!' : 'Like'}
              {likeCount > 0 && ` (${likeCount})`}
            </span>
          </button>
        </div>

        {hasEngagementMetrics && (
          <div className="grid gap-4 sm:grid-cols-3" data-testid="post-engagement-metrics">
            {engagementMetrics.map(metric => (
              <div
                key={metric.label}
                className="rounded-2xl border border-gray-200 bg-white/70 px-5 py-4 shadow-sm transition-colors duration-150 dark:border-gray-700 dark:bg-gray-900/70"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {formatMetric(metric.value)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <CommentSection postId={post.id} />
    </div>
  )

  const renderMobileSidebar = () => {
    if (!isClient || totalHeadings === 0 || showFloatingTOC) {
      return null
    }

    return (
      <aside
        className="mt-10 space-y-10 rounded-3xl border border-gray-200 bg-white/75 p-8 shadow-lg backdrop-blur transition-shadow duration-200 dark:border-gray-800 dark:bg-gray-900/80 lg:hidden"
        aria-label="Article navigation"
      >
        <section data-testid="table-of-contents">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Table of contents
            </h2>
          </div>
          {totalHeadings > 0 ? (
            <div className="mt-4 flex flex-col items-center gap-6">
              <div className="toc-progress mx-auto">
                <svg viewBox="0 0 120 120" className="toc-progress__svg" aria-hidden="true">
                  <circle className="toc-progress__track" cx="60" cy="60" r="52" />
                  <circle
                    className="toc-progress__indicator"
                    cx="60"
                    cy="60"
                    r="52"
                    strokeDasharray={Math.PI * 2 * 52}
                    strokeDashoffset={Math.PI * 2 * 52 * (1 - progress / 100)}
                  />
                </svg>
                <div className="toc-progress__value">
                  <span>{roundedProgress}</span>
                  <small>%</small>
                </div>
              </div>
              <nav className="mx-auto w-full max-w-[260px]" aria-label="Table of contents">
                <ol className="space-y-2">
                  {headings.map((heading, index) => {
                    const isActive = activeHeading === heading.id
                    const isCompleted = activeHeadingIndex !== -1 && index < activeHeadingIndex
                    const isNext = activeHeadingIndex !== -1 && index === activeHeadingIndex + 1

                    return (
                      <li key={heading.id} className="flex justify-center">
                        <a
                          href={`#${heading.id}`}
                          onClick={event => scrollToHeading(heading.id, event, 'floating-toc')}
                          className={`group relative flex w-full max-w-[240px] items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-150 ${
                            isActive
                              ? 'border-blue-200 bg-blue-50/80 text-blue-700 shadow-sm dark:border-blue-500/60 dark:bg-blue-500/20 dark:text-blue-100'
                              : isCompleted
                              ? 'border-blue-100/40 bg-blue-50/40 text-gray-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-gray-100'
                              : 'border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                              isActive
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : isCompleted
                                ? 'border-blue-400 bg-blue-400/70 text-white'
                                : isNext
                                ? 'border-blue-300 text-blue-500'
                                : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span
                            className={`flex-1 text-left leading-snug ${
                              heading.level > 2 ? 'text-xs font-medium md:text-sm' : 'text-sm font-semibold'
                            }`}
                          >
                            {heading.text}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </nav>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
              Headings will appear here as you scroll.
            </p>
          )}
        </section>
      </aside>
    )
  }

  const renderFloatingTOC = () => {
    if (!isClient || !showFloatingTOC || totalHeadings === 0) {
      return null
    }

    return (
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <div className="relative">
          <button
            type="button"
            onClick={() => setFloatingTOCOpen(prev => !prev)}
            className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 ${
              floatingTOCOpen ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            aria-label="Toggle table of contents"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              {floatingTOCOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              )}
            </svg>
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {totalHeadings}
            </div>
          </button>

          {floatingTOCOpen && (
            <div className="absolute bottom-16 right-0 mb-2 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-gray-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom-2 duration-200 dark:border-gray-700/50 dark:bg-gray-900/95">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={Math.PI * 2 * 54}
                        strokeDashoffset={Math.PI * 2 * 54 * (1 - progress / 100)}
                        className="text-blue-600 dark:text-blue-400"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{roundedProgress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Reading Progress</p>
                    {estimatedTimeRemaining && (
                      <p className="text-xs text-blue-600 dark:text-blue-300">{estimatedTimeRemaining}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {headings.map((heading, index) => {
                  const isActive = activeHeading === heading.id
                  const isCompleted = activeHeadingIndex !== -1 && index < activeHeadingIndex

                  return (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={event => {
                        scrollToHeading(heading.id, event, 'mobile-floating-toc')
                        setFloatingTOCOpen(false)
                      }}
                      className={`flex items-center gap-3 rounded-xl p-3 text-sm transition-all duration-150 ${
                        isActive
                          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <span className="flex-1 text-left font-medium leading-tight">{heading.text}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className={containerClasses}>
        {desktopSidebar()}
        {mainContent()}
      </div>
      {renderMobileSidebar()}
      {renderFloatingTOC()}
    </div>
  )
}
