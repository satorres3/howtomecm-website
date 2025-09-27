import { NextRequest, NextResponse } from 'next/server'
import { getDemoPosts } from '../../lib/demoContent'
import type { RSSItem } from '../../../types/content'

export const dynamic = 'force-static'
export const revalidate = 3600 // 1 hour

const DOMAIN = (process.env.WEBSITE_DOMAIN || 'staging.howtomecm.com').trim()
const BASE_URL = `https://${DOMAIN}`

export async function GET(): Promise<NextResponse> {
  try {
    // Use demo content for static export
    const posts = getDemoPosts()
    const settings = {
      site_name: 'How to MeCM',
      description: 'Expert insights on Microsoft Configuration Manager, Azure, and enterprise solutions.',
      author: 'How to MeCM Team'
    }

    // Create RSS items from posts
    const rssItems: RSSItem[] = posts.slice(0, 20).map(post => ({
      title: post.title,
      description: post.excerpt || extractExcerpt(post.content || '', 300),
      link: `${BASE_URL}/blog/${post.slug}`,
      pubDate: new Date(post.date || post.created_at).toUTCString(),
      guid: `${BASE_URL}/blog/${post.slug}`,
      author: post.author?.full_name || 'Anonymous',
      category: post.category?.name || 'Uncategorized',
      ...(post.featured_image && {
        enclosure: {
          url: post.featured_image,
          type: 'image/jpeg',
          length: 0 // We don't have file size info
        }
      })
    }))

    // Generate RSS XML
    const rssXml = generateRSSXML({
      title: settings?.site_name || 'How to MeCM',
      description: settings?.description || 'Professional Content Management',
      link: BASE_URL,
      language: 'en-us',
      lastBuildDate: new Date().toUTCString(),
      items: rssItems
    })

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}

interface RSSChannel {
  title: string
  description: string
  link: string
  language: string
  lastBuildDate: string
  items: RSSItem[]
}

function generateRSSXML(channel: RSSChannel): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <description>${escapeXml(channel.description)}</description>
    <link>${escapeXml(channel.link)}</link>
    <language>${channel.language}</language>
    <lastBuildDate>${channel.lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(channel.link)}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>How to MeCM</generator>
${channel.items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <author>${escapeXml(item.author || '')}</author>
      <category>${escapeXml(item.category || '')}</category>${item.enclosure ? `
      <enclosure url="${escapeXml(item.enclosure.url)}" type="${item.enclosure.type}" length="${item.enclosure.length}" />` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`

  return xml
}

function extractExcerpt(content: string, maxLength: number): string {
  // Remove HTML tags and extract plain text
  const plainText = content.replace(/<[^>]*>/g, '').trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }

  return truncated + '...'
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}