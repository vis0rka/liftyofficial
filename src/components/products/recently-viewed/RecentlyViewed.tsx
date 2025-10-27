'use client'

import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore'
import { ProductsCardsContainer } from '@/moduls/products/CommonProductElements'
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
            <h2 className="heading-2">{t('Common.recently_viewed')}</h2>
            <ProductsCardsContainer>
                {products.map(product => {
                    return <ProductCard product={product} key={product.id} hideViewButton />
                })}
            </ProductsCardsContainer>
        </div>
    )
}
