'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSite } from '../contexts/SiteContext'
import type { SiteNavigationItem } from '@/types/site-content'
// Removed direct database import - data should be passed as props
import DarkModeToggle from './DarkModeToggle'

// Helper function to get social platform colors
function getSocialColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: '#FF0000',
    linkedin: '#0077B5',
    twitter: '#1DA1F2',
    facebook: '#1877F2',
    instagram: '#E4405F',
    github: '#181717',
    tiktok: '#000000',
    discord: '#5865F2'
  }
  return colors[platform.toLowerCase()] || '#6B7280'
}

// Helper component for social icons
function SocialIcon({ platform }: { platform: string }) {
  const iconClass = "w-5 h-5"

  switch (platform.toLowerCase()) {
    case 'youtube':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'instagram':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.989.016 6.756.072 5.525.127 4.64.332 3.892.628c-.776.31-1.435.721-2.09 1.376C1.146 2.66.735 3.319.426 4.095.13 4.843-.075 5.728.072 6.959.016 7.989 0 8.396 0 12.017c0 3.62.016 4.027.072 5.26.127 1.231.332 2.116.628 2.864.31.776.721 1.435 1.376 2.09.655.655 1.314 1.066 2.09 1.376.748.296 1.633.501 2.864.628 1.233.056 1.64.072 5.26.072 3.62 0 4.027-.016 5.26-.072 1.231-.127 2.116-.332 2.864-.628.776-.31 1.435-.721 2.09-1.376.655-.655 1.066-1.314 1.376-2.09.296-.748.501-1.633.628-2.864.056-1.233.072-1.64.072-5.26 0-3.62-.016-4.027-.072-5.26-.127-1.231-.332-2.116-.628-2.864-.31-.776-.721-1.435-1.376-2.09C20.349 1.146 19.69.735 18.914.426c-.748-.296-1.633-.501-2.864-.628C14.817.016 14.41 0 10.79 0L12.017 0zm0 2.162c3.557 0 3.983.016 5.383.071 1.298.059 2.005.277 2.477.461.623.242 1.068.532 1.535.999.467.467.757.912.999 1.535.184.472.402 1.179.461 2.477.055 1.4.071 1.826.071 5.383 0 3.557-.016 3.983-.071 5.383-.059 1.298-.277 2.005-.461 2.477-.242.623-.532 1.068-.999 1.535-.467.467-.912.757-1.535.999-.472.184-1.179.402-2.477.461-1.4.055-1.826.071-5.383.071-3.557 0-3.983-.016-5.383-.071-1.298-.059-2.005-.277-2.477-.461-.623-.242-1.068-.532-1.535-.999-.467-.467-.757-.912-.999-1.535-.184-.472-.402-1.179-.461-2.477-.055-1.4-.071-1.826-.071-5.383 0-3.557.016-3.983.071-5.383.059-1.298.277-2.005.461-2.477.242-.623.532-1.068.999-1.535.467-.467.912-.757 1.535-.999.472-.184 1.179-.402 2.477-.461 1.4-.055 1.826-.071 5.383-.071z"/>
          <path d="M12.017 15.033c-1.671 0-3.025-1.354-3.025-3.025s1.354-3.025 3.025-3.025 3.025 1.354 3.025 3.025-1.354 3.025-3.025 3.025zM12.017 5.838c-3.394 0-6.162 2.768-6.162 6.162s2.768 6.162 6.162 6.162 6.162-2.768 6.162-6.162-2.768-6.162-6.162-6.162zM18.406 4.155c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z"/>
        </svg>
      )
    case 'github':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
  }
}

const fallbackNavigation: SiteNavigationItem[] = [
  { id: 'home', label: 'Home', href: '/', target: '_self', is_active: true, order: 1 },
  { id: 'blog', label: 'Blog', href: '/blog', target: '_self', is_active: true, order: 2 },
  { id: 'about', label: 'About', href: '/about', target: '_self', is_active: true, order: 3 },
  { id: 'contact', label: 'Contact', href: '/contact', target: '_self', is_active: true, order: 4 },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { settings, navigation } = useSite()

  if (!settings) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-64 rounded"></div>
            </div>
          </div>
        </nav>
      </header>
    )
  }

  const headerNavigation = (navigation?.primary?.length ? navigation.primary : fallbackNavigation).filter(
    item => item.is_active !== false
  )
  const socialLinks: any[] = []
  const showSearch = false
  const fallbackLogo = {
    url: 'https://assets.zyrosite.com/A0xw0LoMOVtarQa0/how-to-mk3zRRxqrQFyKNnl.gif',
    alt: 'How to MeCM logo',
    width: 56,
    height: 56
  }
  const logo = settings.logo?.url
    ? {
        url: settings.logo.url,
        alt: settings.logo.alt || `${settings.site_name} logo`,
        width: settings.logo.width || 56,
        height: settings.logo.height || 56
      }
    : fallbackLogo

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Dynamic navigation */}
      <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30">
        <div style={{ maxWidth: 'var(--container-max-width, 1200px)' }} className="mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Dynamic Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image
                    src={logo.url}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    {settings.site_name}
                  </span>
                  {settings.tagline && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                      {settings.tagline}
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Dynamic Navigation Links */}
              {headerNavigation.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.href || item.url || '#'}
                  target={item.target || '_self'}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}

              {/* Dynamic Social Icons */}
              {socialLinks.length > 0 && (
                <div className="flex items-center space-x-2">
                  {socialLinks.map((social: any) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-600/90 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                      title={social.label || social.platform}
                      style={{
                        backgroundColor: getSocialColor(social.platform)
                      }}
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              )}

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Enhanced Search Bar */}
              {showSearch && (
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
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                id="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
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
        </div>

        {/* Dynamic Mobile menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
            role="menu"
            aria-labelledby="mobile-menu-button"
          >
            <div className="space-y-2">
              {headerNavigation.map((item: any) => (
                <Link
                  key={`mobile-${item.id}`}
                  href={item.href || item.url || '#'}
                  target={item.target || '_self'}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Social Icons */}
            {socialLinks.length > 0 && (
              <div className="mt-4 px-4">
                <div className="flex items-center justify-center space-x-4">
                  {socialLinks.map((social: any) => (
                    <a
                      key={`mobile-${social.id}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 text-white rounded-lg flex items-center justify-center transition-colors group"
                      title={social.label || social.platform}
                      style={{
                        backgroundColor: getSocialColor(social.platform)
                      }}
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Search */}
            {showSearch && (
              <div className="mt-4 px-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Mobile Dark Mode Toggle */}
            <div className="mt-4 px-4 flex justify-center">
              <DarkModeToggle />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
