import { routing } from '@/i18n/routing'
import { getCachedProducts } from '@/lib/api/woo/products/getProducts'
import { MetadataRoute } from 'next'

const staticRoutes = ['', '/shop', '/about-us', '/shipping-policy', '/refund-policy', '/privacy-policy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://liftyofficial.com'
    const locales = routing.locales

    // Generate static routes for all locales
    const staticUrls: MetadataRoute.Sitemap = []
    for (const locale of locales) {
        for (const route of staticRoutes) {
            staticUrls.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: route === '' ? 1.0 : 0.7,
            })
        }
    }

    // Generate product routes for all locales
    const productUrls: MetadataRoute.Sitemap = []
    try {
        const products = await getCachedProducts()
        if (products && Array.isArray(products)) {
            for (const product of products) {
                if (product.slug && product.status === 'publish') {
                    for (const locale of locales) {
                        productUrls.push({
                            url: `${baseUrl}/${locale}/shop/${product.slug}`,
                            lastModified: product.date_modified ? new Date(product.date_modified) : new Date(),
                            changeFrequency: 'daily',
                            priority: 0.8,
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error fetching products for sitemap:', error)
    }

    return [...staticUrls, ...productUrls]
}
