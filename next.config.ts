import type { NextConfig } from "next";
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
const nextConfig: NextConfig = {
  output: 'standalone'
};

module.exports = withNextIntl(nextConfig);
