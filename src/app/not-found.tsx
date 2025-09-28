import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | How to MeCM',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-6 dark:from-gray-900 dark:to-blue-900">
      <div className="w-full max-w-lg text-center">
        <div className="mb-8">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg
              className="h-16 w-16 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>

          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>

          <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. This could
            be due to content not being available in our CMS or an incorrect URL.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <Link
            href="/"
            className="block w-full rounded-lg bg-blue-600 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Homepage
          </Link>

          <Link
            href="/blog"
            className="block w-full rounded-lg border border-gray-300 bg-white px-6 py-4 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Browse Blog Articles
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Looking for something specific?
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• Check if the URL is spelled correctly</p>
            <p>• The content may have been moved or removed</p>
            <p>• Our CMS may not have this content published</p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">
              Contact us for help
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
