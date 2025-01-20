/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next'
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        WOO_KEY: process.env.WOO_KEY,
        WOO_SECRET: process.env.WOO_SECRET,
        STRIPE_KEY: process.env.STRIPE_KEY,
    },
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'liftyofficial.com' }],
    },
}

module.exports = withNextIntl(nextConfig)
