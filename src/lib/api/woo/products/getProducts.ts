'use server'

import { unstable_cache } from 'next/cache'
import { wooApi } from '../woo'

export const getCachedProducts = unstable_cache(
    async () => {
        try {
            const result = await wooApi.getProducts({
                per_page: 100,
                status: 'publish',
            })
            console.log('result', result)
            return result
        } catch (error) {
            console.error(error)
        }
    },
    ['products'],
    { revalidate: 60 * 60 * 1 },
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
    { revalidate: 300 },
) // 5 minutes
