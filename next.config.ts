/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next'
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        WOO_KEY: process.env.WOO_KEY,
        WOO_SECRET: process.env.WOO_SECRET,
        STRIPE_API_PUBLIC: process.env.STRIPE_API_PUBLIC,
        STRIPE_API_SECRET: process.env.STRIPE_API_SECRET,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    },
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'liftyofficial.com' }],
    },
    experimental: {
        viewTransition: true,
    },
}

module.exports = withNextIntl(nextConfig)
