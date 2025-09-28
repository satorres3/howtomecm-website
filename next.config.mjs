import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security configurations
  poweredByHeader: false, // Security: Remove powered by header

  // Performance configurations
  compress: true, // Performance: Compress responses

  // MDX support
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Bundle optimization
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react'], // Optimize icon imports
  },

  // Security headers with Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://youtube.com https://www.youtube.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' data: blob: https://assets.zyrosite.com https://i.ytimg.com https://img.youtube.com",
              "media-src 'self' https://youtube.com https://www.youtube.com",
              "frame-src 'self' https://youtube.com https://www.youtube.com",
              "connect-src 'self' https://www.google-analytics.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },

  // Image optimization with secure remote patterns
  images: {
    unoptimized: true, // Allow external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.zyrosite.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      }
    ],
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize client-side chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
          },
          vendor: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },

}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
