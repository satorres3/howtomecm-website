import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | How to MeCM',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Page Not Found
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved. This could be due to content not being available in our CMS or an incorrect URL.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Homepage
          </Link>

          <Link
            href="/blog"
            className="block w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-4 px-6 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Browse Blog Articles
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Looking for something specific?
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>• Check if the URL is spelled correctly</p>
            <p>• The content may have been moved or removed</p>
            <p>• Our CMS may not have this content published</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still can't find what you're looking for?{' '}
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contact us for help
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}