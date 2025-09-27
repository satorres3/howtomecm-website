import Link from 'next/link'
import type { Tag } from '../../../types/content'

interface TagListProps {
  tags: Tag[]
  variant?: 'default' | 'minimal'
  showIcons?: boolean
}

function getTagIcon(tagName: string): JSX.Element | null {
  const lowerName = tagName.toLowerCase()

  // Only show icons for non-obvious or technical terms
  if (lowerName.includes('graph') || lowerName.includes('api')) {
    return (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2M6.5 12.5L7.5 16.5L11.5 15.5L10.5 11.5L6.5 12.5M12.5 11.5L16.5 12.5L15.5 16.5L11.5 15.5L12.5 11.5Z"/>
      </svg>
    )
  }

  if (lowerName.includes('security') || lowerName.includes('compliance')) {
    return (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
      </svg>
    )
  }

  // No icons for obvious Microsoft products (Intune, SCCM, Defender, Copilot, Entra ID, etc.)
  return null
}

export default function TagList({ tags, variant = 'default', showIcons = true }: TagListProps) {
  if (!tags || tags.length === 0) return null

  const baseClasses = "inline-flex items-center gap-1 rounded-full text-sm transition-colors"

  const variantClasses = {
    default: "bg-gray-100 px-3 py-1.5 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
    minimal: "bg-blue-50 px-2 py-1 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200"
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map(tag => (
        <Link
          key={tag.id}
          href={`/blog?tag=${tag.slug}`}
          className={`${baseClasses} ${variantClasses[variant]}`}
          title={`View posts tagged with ${tag.name}`}
        >
          {showIcons && getTagIcon(tag.name)}
          {tag.name}
        </Link>
      ))}
    </div>
  )
}