'use server'

import { unstable_cache } from 'next/cache'
import { wooApi } from '../woo'

const cacheTime: Record<string, number> = {
    products: process.env.NODE_ENV === 'production' ? 60 * 60 * 1 : 60 * 1, // 1 hours
    product: process.env.NODE_ENV === 'production' ? 60 * 10 : 60 * 1, // 10 minutes
}

export const getCachedProducts = unstable_cache(
    async () => {
        const result = await wooApi.getProducts({
            per_page: 100,
            status: 'publish',
        })
        return result
    },
    ['products'],
    { revalidate: cacheTime.products },
)

export const getCachedProduct = unstable_cache(
    async (slug: string) => {
        return await wooApi.getProducts({ slug })
    },
    ['product'],
    { revalidate: cacheTime.product },
)
