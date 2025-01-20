'use client'

import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore'
import { useTranslations } from 'next-intl'
import { ProductCard } from '../card/ProductCard'

export function RecentlyViewed() {
    const { products } = useRecentlyViewedStore()
    const t = useTranslations()
    if (products?.length === 0) {
        return null
    }

    return (
        <div className="mt-8">
            <h2 className="~text-xl/3xl font-bold mb-4">{t('Common.recently_viewed')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map(product => {
                    return <ProductCard product={product} key={product.id} />
                })}
            </div>
        </div>
    )
}
