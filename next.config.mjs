/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export to minimize bundle size
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Required for static export
  poweredByHeader: false, // Security: Remove powered by header
  compress: true, // Performance: Compress responses
}

export default nextConfig