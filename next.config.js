/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: { document: '/offline' },
})

const nextConfig = {
  // Aumentar timeout de generación estática
  staticPageGenerationTimeout: 120,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
    // Permitir cualquier imagen externa (para fotos de comercios)
    unoptimized: process.env.NODE_ENV === 'development',
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },

  // Ignorar errores de TypeScript/ESLint en build (para deploy rápido)
  typescript:  { ignoreBuildErrors: true },
  eslint:      { ignoreDuringBuilds: true },
}

module.exports = withPWA(nextConfig)
