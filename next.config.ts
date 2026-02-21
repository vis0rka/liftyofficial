import type { NextConfig } from 'next'
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    output: 'standalone',
    images: { remotePatterns: [{ protocol: 'https', hostname: 'liftyofficial.com' }] },
    experimental: { viewTransition: true },
}

module.exports = withNextIntl(nextConfig)
