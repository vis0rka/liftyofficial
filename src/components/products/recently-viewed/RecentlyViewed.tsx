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
        <div className="space-y-4">
            <h2 className="~text-xl/4xl">{t('Common.recently_viewed')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.map(product => {
                    return <ProductCard product={product} key={product.id} hideViewButton />
                })}
            </div>
        </div>
    )
}
