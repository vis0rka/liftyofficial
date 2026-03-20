'use server'

import { unstable_cache } from 'next/cache'
import { wooApi } from '../woo'

const cacheTime: Record<string, number> = {
    products: process.env.NODE_ENV === 'production' ? 60 * 60 * 1 : 60 * 1, // 1 hours
    product: process.env.NODE_ENV === 'production' ? 60 * 10 : 60 * 1, // 10 minutes
}

export async function getCachedProducts() {
    return unstable_cache(
        async () => {
            const result = await wooApi.getProducts({
                per_page: 100,
                status: 'publish',
            })
            return result
        },
        ['products'],
        { revalidate: cacheTime.products },
    )()
}

export async function getCachedProduct(slug: string) {
    return unstable_cache(
        async () => {
            try {
                return await wooApi.getProducts({ slug })
            } catch (error) {
                console.error(error)
            }
        },
        ['product', slug],
        { revalidate: cacheTime.product },
    )()
}
