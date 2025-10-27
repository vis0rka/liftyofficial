'use client'

import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore'
import { ProductCarousel } from '@/moduls/products/ProductsCarousel'
import { useTranslations } from 'next-intl'

export function RecentlyViewed() {
    const { products } = useRecentlyViewedStore()
    const t = useTranslations()

    if (products?.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            <h2 className="heading-2">{t('Common.recently_viewed')}</h2>
            <ProductCarousel products={products} />
        </div>
    )
}
