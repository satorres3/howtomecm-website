import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Webhook endpoint for CMS content updates
 * Triggered when content is created, updated, or deleted in the CMS
 */
export async function POST(request: NextRequest) {
  try {
    const { type, action, slug, domain } = await request.json()

    // Verify webhook secret (optional but recommended)
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`[WEBHOOK] ${action} ${type} - ${slug} (${domain})`)

    // Revalidate based on content type and action
    switch (type) {
      case 'page':
        // Revalidate specific page
        if (slug) {
          revalidatePath(`/${slug}`)
        }
        // Revalidate homepage if needed
        revalidatePath('/')
        // Revalidate sitemap
        revalidatePath('/sitemap.xml')
        break

      case 'post':
        // Revalidate blog pages
        revalidatePath('/blog')
        if (slug) {
          revalidatePath(`/blog/${slug}`)
        }
        // Revalidate homepage (for recent posts)
        revalidatePath('/')
        // Revalidate sitemap
        revalidatePath('/sitemap.xml')
        break

      case 'media':
        // Clear media cache
        revalidateTag('media')
        break

      case 'category':
        // Revalidate all blog content
        revalidatePath('/blog')
        revalidateTag('categories')
        break

      case 'tag':
        // Revalidate all blog content
        revalidatePath('/blog')
        revalidateTag('tags')
        break

      case 'settings':
        // Revalidate entire site
        revalidatePath('/', 'layout')
        break

      default:
        // Fallback: revalidate everything
        revalidatePath('/', 'layout')
        break
    }

    return NextResponse.json({
      message: 'Revalidation triggered successfully',
      type,
      action,
      slug,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[WEBHOOK] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Webhook endpoint is active'
  })
}