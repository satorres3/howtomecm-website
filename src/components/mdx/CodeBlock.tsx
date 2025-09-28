'use client'

import React, { useState } from 'react'

interface CodeBlockProps {
  children: string
  className?: string
  title?: string
}

export default function CodeBlock({ children, className = '', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  // Extract language from className
  const language = className.replace('language-', '')

  return (
    <div className="code-block-wrapper relative my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {title && (
        <div className="border-b border-gray-200 bg-gray-100 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        </div>
      )}
      <div className="relative">
        <pre className="code-block__content m-0 overflow-x-auto bg-transparent p-6 font-mono text-sm leading-relaxed">
          <code className={className}>{children}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          data-copy-control="true"
          className={`code-copy-trigger absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition-all duration-200 ${
            copied
              ? 'border-green-400/60 bg-green-500/85 text-white'
              : error
                ? 'border-red-400/60 bg-red-500/85 text-white'
                : 'border-gray-300/50 bg-white/90 text-gray-600 hover:border-gray-400 hover:bg-white hover:text-gray-700 dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="code-copy-trigger__label">
            {copied ? 'Copied!' : error ? 'Try again' : 'Copy'}
          </span>
        </button>
      </div>
    </div>
  )
}
