import type { NextConfig } from 'next'
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        minimumCacheTTL: 2678400,
        formats: ['image/webp'],
        qualities: [75],
        deviceSizes: [640, 828, 1080, 1200, 1920],
        imageSizes: [96, 128, 300, 384, 600, 640],
        remotePatterns: [
            { protocol: 'https', hostname: 'admin.liftyofficial.com' },
            { protocol: 'https', hostname: 'liftyofficial.com' },
            { protocol: 'https', hostname: '*.liftyofficial.com' },
        ],
    },
    headers: async () => [
        {
            source: '/images/:path*',
            headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
    ],
    experimental: { viewTransition: true, inlineCss: true },
}

module.exports = withNextIntl(nextConfig)
