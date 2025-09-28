import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '500 - Server Error | How to MeCM',
  description: 'Internal server error. Our content management system is temporarily unavailable.',
}

export default function Custom500() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-6 dark:from-gray-900 dark:to-red-900">
      <div className="w-full max-w-lg text-center">
        <div className="mb-8">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-16 w-16 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">500</h1>

          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Content Management System Unavailable
          </h2>

          <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Our content management system is temporarily experiencing issues. This prevents us from
            loading the latest content from our database.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <Link
            href="/"
            className="block w-full rounded-lg bg-blue-600 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Homepage
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="block w-full rounded-lg border border-gray-300 bg-white px-6 py-4 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Refresh Page
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            What happened?
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• Our content management system (CMS) is temporarily unavailable</p>
            <p>• Database connection may have been interrupted</p>
            <p>• Content fetching services are experiencing issues</p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We&apos;re working to resolve this issue. For urgent matters, please{' '}
            <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">
              contact us directly
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
