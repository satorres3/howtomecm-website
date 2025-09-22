/**
 * Content processing utilities for blog posts
 */

export interface TOCItem {
  id: string
  title: string
  level: number
}

/**
 * Processes HTML content to add IDs to headings and extract TOC items
 * Also enhances formatting for better readability
 */
export function processContentForTOC(htmlContent: string): {
  processedContent: string
  tocItems: TOCItem[]
} {
  if (!htmlContent) {
    return { processedContent: '', tocItems: [] }
  }

  const tocItems: TOCItem[] = []

  // First pass: Enhance formatting by adding line breaks and spacing
  let enhancedContent = htmlContent
    // Add line breaks after headings
    .replace(/(<\/h[1-6]>)\s*(?!<)/gi, '$1\n\n')
    // Add line breaks after paragraphs
    .replace(/(<\/p>)\s*(?=<p>)/gi, '$1\n\n')
    // Add line breaks after lists
    .replace(/(<\/ul>|<\/ol>)\s*(?=<)/gi, '$1\n\n')
    // Add line breaks before headings (except h1)
    .replace(/(?<!^|\n\n)(<h[2-6][^>]*>)/gi, '\n\n$1')
    // Ensure proper spacing around divs
    .replace(/(<div[^>]*>)\s*/gi, '$1\n')
    .replace(/\s*(<\/div>)/gi, '\n$1\n\n')

  // Second pass: Add IDs to headings and extract TOC items
  const processedContent = enhancedContent.replace(
    /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi,
    (match, tag, attributes, content) => {
      const level = parseInt(tag.charAt(1))
      const textContent = content.replace(/<[^>]*>/g, '').trim()

      // Generate a clean ID from the heading text
      const id = textContent
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        || `heading-${tocItems.length + 1}` // Fallback ID

      // Check if ID already exists in attributes
      const hasId = /id\s*=\s*["'][^"']*["']/i.test(attributes)

      if (!hasId) {
        tocItems.push({ id, title: textContent, level })
        // Add ID to the heading tag
        const newAttributes = attributes.trim() ? `${attributes} id="${id}"` : `id="${id}"`
        return `<${tag} ${newAttributes}>${content}</${tag}>`
      } else {
        // Extract existing ID
        const idMatch = attributes.match(/id\s*=\s*["']([^"']*)["']/i)
        const existingId = idMatch ? idMatch[1] : id
        tocItems.push({ id: existingId, title: textContent, level })
        return match // Return unchanged if ID already exists
      }
    }
  )

  return { processedContent, tocItems }
}

/**
 * Generates a unique ID from text content
 */
export function generateHeadingId(text: string, existingIds: Set<string> = new Set()): string {
  let baseId = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!baseId) {
    baseId = 'heading'
  }

  let id = baseId
  let counter = 1

  while (existingIds.has(id)) {
    id = `${baseId}-${counter}`
    counter++
  }

  existingIds.add(id)
  return id
}