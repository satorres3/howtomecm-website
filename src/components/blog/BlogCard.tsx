import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '../../../types/content'

interface BlogCardProps {
  post: Post
  fallbackImages?: string[]
  index?: number
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return date
  }
}

const DEFAULT_FALLBACKS = [
  '/images/blog/default-card.svg',
  '/images/blog/default-card-2.svg',
  '/images/blog/default-card-3.svg'
]

export default function BlogCard({ post, fallbackImages = DEFAULT_FALLBACKS, index = 0 }: BlogCardProps) {
  const imageSrc: string = post.featured_image || fallbackImages[index % fallbackImages.length] || DEFAULT_FALLBACKS[0]!
  const readingTime = post.reading_time ? `${post.reading_time} min read` : null

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      data-testid="blog-card"
    >
      <div className="relative overflow-hidden">
        <div className="relative aspect-[5/3] sm:aspect-[4/3]">
          <Image
            src={imageSrc}
            alt={post.title ? `${post.title} featured image` : 'Blog article visual'}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 36vw, (min-width: 768px) 42vw, 100vw"
            priority={index < 2}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" aria-hidden="true" />
        {post.category?.name && (
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-lg backdrop-blur">
            {post.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-6 px-7 pb-8 pt-7 sm:px-8">
        <div className="space-y-4">
          <time dateTime={post.created_at} className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
            {formatDate(post.created_at)}
          </time>
          <h3 className="text-2xl font-semibold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-300">
              {post.title}
            </Link>
          </h3>
          {post.excerpt && (
            <p className="text-base leading-relaxed text-gray-600 line-clamp-4 dark:text-gray-300">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-sm">
          <div className="flex flex-wrap items-center gap-3">
            {readingTime && <span>{readingTime}</span>}
            {post.author?.full_name && <span aria-label={`Author ${post.author.full_name}`}>{post.author.full_name}</span>}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/20 dark:text-blue-200 dark:group-hover:bg-blue-500 sm:text-sm"
            aria-label={`Read article ${post.title}`}
          >
            Read article
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
