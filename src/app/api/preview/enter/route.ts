import { NextRequest } from 'next/server'
import { enablePreviewMode } from '../../../../../lib/preview'

/**
 * API route to enable preview mode
 * POST /api/preview/enter
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return Response.json(
        { error: 'Preview token is required' },
        { status: 400 }
      )
    }

    return enablePreviewMode(token)
  } catch (error) {
    console.error('Preview mode error:', error)
    return Response.json(
      { error: 'Failed to enable preview mode' },
      { status: 500 }
    )
  }
}

/**
 * GET handler for enabling preview mode via URL
 * GET /api/preview/enter?token=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return Response.json(
      { error: 'Preview token is required' },
      { status: 400 }
    )
  }

  return enablePreviewMode(token)
}