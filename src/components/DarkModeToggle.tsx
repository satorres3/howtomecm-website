'use client'

import { useTheme } from '../contexts/SiteContext'

export default function DarkModeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-12 items-center justify-center rounded-full transition-all duration-300 ease-in-out ${
        isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${className} `}
      aria-label={
        isDark
          ? 'Switch to light mode - dark mode currently active'
          : 'Switch to dark mode - light mode currently active'
      }
    >
      <span
        className={`absolute inline-block h-4 w-4 rounded-full transition-transform duration-300 ease-in-out ${
          isDark ? 'translate-x-3 bg-white' : 'translate-x-1 bg-white'
        } `}
      />

      {/* Sun icon */}
      <svg
        className={`absolute left-1 h-3 w-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'text-yellow-500 opacity-100'} `}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clipRule="evenodd"
        />
      </svg>

      {/* Moon icon */}
      <svg
        className={`absolute right-1 h-3 w-3 transition-opacity duration-300 ${isDark ? 'text-blue-200 opacity-100' : 'opacity-0'} `}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </button>
  )
}
