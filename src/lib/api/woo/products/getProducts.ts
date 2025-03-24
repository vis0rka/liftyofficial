'use server'

import { unstable_cache } from 'next/cache'
import { wooApi } from '../woo'
import { WooTypes } from '../WooTyps'

export async function getProducts() {
    try {
        const result = await wooApi.get('products', {})
        return result?.data as WooTypes['getProducts']
    } catch (error) {
        console.error(error)
    }
}

export const getCachedProducts = unstable_cache(async () => getProducts(), ['featured'], {
    revalidate: 3600,
    tags: ['products'],
})

export async function getProduct(slug: string) {
    try {
        const result = await wooApi.get('products', {
            slug,
        })
        return result?.data as WooTypes['getProducts']
    } catch (error) {
        console.error(error)
    }
}

export const getCachedProduct = unstable_cache(async (slug: string) => getProduct(slug), ['slug'], {
    revalidate: 600,
    tags: ['products'],
})
