'use server'

import { unstable_cache } from 'next/cache'
import { wooApi } from '../woo'
import { WooTypes } from '../WooTyps'

async function getProducts() {
    try {
        const result = await wooApi.get('products', {
            per_page: 20, // 20 products per page
        })
        return result?.data as WooTypes['getProducts']
    } catch (error) {
        console.error(error)
    }
}

export const getCachedProducts = unstable_cache(async () => getProducts(), ['featured'], {
    revalidate: 60,
    tags: ['products'],
})
