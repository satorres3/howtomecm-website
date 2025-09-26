import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '500 - Server Error | How to MeCM',
  description: 'Internal server error. Our content management system is temporarily unavailable.',
}

export default function Custom500() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="w-32 h-32 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            500
          </h1>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Content Management System Unavailable
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Our content management system is temporarily experiencing issues. This prevents us from loading the latest content from our database.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Homepage
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="block w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-4 px-6 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What happened?
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>• Our content management system (CMS) is temporarily unavailable</p>
            <p>• Database connection may have been interrupted</p>
            <p>• Content fetching services are experiencing issues</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We're working to resolve this issue. For urgent matters, please{' '}
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              contact us directly
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}