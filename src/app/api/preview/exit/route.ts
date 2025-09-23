import { disablePreviewMode } from '../../../../../lib/preview'

/**
 * API route to disable preview mode
 * POST /api/preview/exit
 */
export async function POST() {
  try {
    return disablePreviewMode()
  } catch (error) {
    console.error('Exit preview mode error:', error)
    return Response.json(
      { error: 'Failed to exit preview mode' },
      { status: 500 }
    )
  }
}

/**
 * GET handler for disabling preview mode via URL
 * GET /api/preview/exit
 */
export async function GET() {
  return disablePreviewMode()
}