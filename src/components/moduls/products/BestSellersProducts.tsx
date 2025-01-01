'use server'
import { getCachedProducts } from '@/lib/api/woo/products/getProducts'
import { getTranslations } from 'next-intl/server'
import { ProductCard } from '../../products/card/ProductCard'

export const BestSellersProducts = async () => {
    const allProduct = await getCachedProducts()
    const t = await getTranslations()

    if (!allProduct) return null

    const sortedProducts = [...allProduct].sort((a, b) => b.total_sales - a.total_sales).splice(0, 4)

    return (
        <section className="container mx-auto flex flex-col px-4">
            <div className="flex w-full flex-col space-y-4">
                <h1 className="text-4xl">{t('HomePage.bestsellers')}:</h1>
                <div className="flex w-full overflow-x-auto py-4 lg:grid-cols-4 lg:overflow-visible gap-4">
                    {sortedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
