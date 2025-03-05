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
            <h2 className="~text-2xl/4xl">{t('Common.recently_viewed')}</h2>
            <div className="flex w-full overflow-x-auto py-4 lg:grid lg:grid-cols-4 lg:overflow-visible gap-4">
                {products.map(product => {
                    return <ProductCard product={product} key={product.id} hideViewButton />
                })}
            </div>
        </div>
    )
}
