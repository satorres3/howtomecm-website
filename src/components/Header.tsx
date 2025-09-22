'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism navigation */}
      <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo with rotation effect */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <img
                  src="https://assets.zyrosite.com/A0xw0LoMOVtarQa0/how-to-mk3zRRxqrQFyKNnl.gif"
                  alt="How to MeCM Logo"
                  className="w-10 h-10 object-contain transition-transform duration-300 group-hover:rotate-12"
                />
                <div>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    <span className="text-blue-600 dark:text-blue-400">Portal</span>{' '}
                    <span className="text-purple-600 dark:text-purple-400">Blog</span>
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    The Official Portal Blog
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Navigation Links with Active State */}
              <Link href="/blog" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 group">
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link href="/about" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Social Icons */}
              <div className="flex items-center space-x-2">
                <a
                  href="https://youtube.com/@howtomecm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600/90 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  title="Watch on YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a
                  href="https://linkedin.com/in/sauloalvestorres"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#0077B5]/90 hover:bg-[#0077B5] text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative">
                <div className={`transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-64'}`}>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-gray-800/70 border border-gray-300/50 dark:border-gray-600/50 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Blog
              </Link>
              <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                About
              </Link>
            </div>

            {/* Mobile Social Icons */}
            <div className="mt-4 px-4">
              <div className="flex items-center justify-center space-x-4">
                <a
                  href="https://youtube.com/@howtomecm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors group"
                  title="Watch on YouTube"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a
                  href="https://linkedin.com/in/sauloalvestorres"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[#0077B5] hover:bg-[#005885] text-white rounded-lg flex items-center justify-center transition-colors group"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-4 px-4">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}