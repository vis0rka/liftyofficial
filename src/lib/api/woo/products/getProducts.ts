'use server'

import { unstable_cache } from 'next/cache'
import { wooApi } from '../woo'

const cacheTime: Record<string, number> = {
    products: process.env.NODE_ENV === 'production' ? 60 * 60 * 1 : 60 * 1, // 1 hours
    product: process.env.NODE_ENV === 'production' ? 60 * 10 : 60 * 1, // 10 minutes
}

export const getCachedProducts = unstable_cache(
    async () => {
        try {
            const result = await wooApi.getProducts({
                per_page: 100,
                status: 'publish',
            })
            return result
        } catch (error) {
            console.error(error)
        }
    },
    ['products'],
    { revalidate: cacheTime.products },
) // 1 hours

export const getCachedProduct = unstable_cache(
    async (slug: string) => {
        try {
            const result = await wooApi.getProducts({
                slug,
            })

            return result
        } catch (error) {
            console.error(error)
        }
    },
    ['product'],
    { revalidate: cacheTime.product },
) // 5 minutes
