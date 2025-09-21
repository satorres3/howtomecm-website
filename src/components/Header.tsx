'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>Professional Microsoft Technology Consulting</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-blue-300 transition-colors">Sign in</a>
              <a href="#" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">How to MeCM</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <span>Solutions</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <a href="/blog?category=mecm" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Configuration Manager</a>
                  <a href="/blog?category=azure" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Azure Solutions</a>
                  <a href="/blog?category=intune" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Microsoft Intune</a>
                  <a href="/blog?category=powershell" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">PowerShell</a>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <span>Resources</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <a href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Blog</a>
                  <a href="/blog?category=tutorials" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Tutorials</a>
                  <a href="/blog?category=best-practices" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Best Practices</a>
                  <a href="/blog?category=case-studies" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Case Studies</a>
                </div>
              </div>
            </div>

            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Blog
            </Link>

            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
              <Link href="/blog?category=mecm" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Configuration Manager
              </Link>
              <Link href="/blog?category=azure" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Azure Solutions
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Contact
              </Link>
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