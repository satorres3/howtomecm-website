'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-6 dark:from-gray-900 dark:to-blue-900">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-12 w-12 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>

          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            We&apos;re having trouble loading the content. This could be due to a temporary issue
            with our content management system.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="block w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Go to Homepage
          </Link>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
