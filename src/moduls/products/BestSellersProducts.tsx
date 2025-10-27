'use server'
import { getCachedProducts } from '@/lib/api/woo/products/getProducts'
import { getTranslations } from 'next-intl/server'
import { ProductCarousel } from './ProductsCarousel'

export const BestSellersProducts = async () => {
    const allProduct = await getCachedProducts()
    const t = await getTranslations()

    if (!allProduct) return null

    const sortedProducts = [...allProduct].sort((a, b) => b.total_sales - a.total_sales).slice(0, 6)

    return (
        <div className="flex w-full flex-col space-y-4">
            <h1 className="heading-2">{t('HomePage.bestsellers')}:</h1>
            <ProductCarousel products={sortedProducts} />
        </div>
    )
}
