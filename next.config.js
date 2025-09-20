/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['supabase.com'], // Add your Supabase storage domain
  },
  env: {
    CUSTOM_KEY: 'howtomecm-website',
  },
}

module.exports = nextConfig