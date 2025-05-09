import { ErrorCard } from '@/components/error/ErrorCard'
import { AddToCartBtn } from '@/components/products/card/AddToCartBtn'
import { CarrierFeatures } from '@/components/products/descriptions/features/CarrierFeatures'
import { CarrierLongDescription } from '@/components/products/descriptions/long/CarrierLongDescription'
import { CarrierShortDescription } from '@/components/products/descriptions/short/CarrierShortDescription'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { AddToRecentlyViewed } from '@/components/products/recently-viewed/AddToRecentlyViewed'
import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductPrice } from '@/hooks/useGetProductPrice'
import { getCachedProduct } from '@/lib/api/woo/products/getProducts'
import { BestSellersProducts } from '@/moduls/products/BestSellersProducts'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ slug: string }>
}

const tagsToCarrierFeatures = {
    carrier: <CarrierFeatures key="carrier-features" />,
}

const tagsToShortDescription = {
    carrier: <CarrierShortDescription key="carrier-short-desc" />,
}

const tagsToLongDescription = {
    carrier: <CarrierLongDescription key="carrier-long-desc" />,
}

export default async function ProductDetailsPage({ params }: Props) {
    const { slug } = await params

    const data = await getCachedProduct(slug)

    const t = await getTranslations()

    const product = data?.[0]

    if (!product) {
        return <ErrorCard />
    }

    const inStock = product?.stock_quantity > 0 || product.backorders_allowed

    const tagsToShort = product.tags?.reduce((acc, item) => {
        acc[item.name] = tagsToShortDescription[item.name]
        return acc
    }, {})

    const tagsToLong = product.tags?.reduce((acc, item) => {
        acc[item.name] = tagsToLongDescription[item.name]
        return acc
    }, {})

    const tagsToFeatures = product.tags?.reduce((acc, item) => {
        acc[item.name] = tagsToCarrierFeatures[item.name]
        return acc
    }, {})

    return (
        <section className="container mx-auto flex flex-col my-6 space-y-6">
            <Breadcrumb />
            <div className="flex flex-col lg:flex-row gap-4">
                <ProductImageGallery images={product.images} />
                <Card className="basis-1/2">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="~text-xl/4xl">{product.name}</h1>
                            <span className="font-sans ~text-lg/2xl">
                                <ProductPrice prices={product.custom_prices} price={product.price} />
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 flex flex-col items-start">
                            {Object.values(tagsToFeatures)}

                            {Object.values(tagsToShort)}
                            {inStock ? (
                                <Badge variant="success">{t('Product.in_stock')}</Badge>
                            ) : (
                                <Badge variant="outline">{t('Product.out_stock')}</Badge>
                            )}
                            {<AddToCartBtn product={product} buttonProps={{ disabled: !inStock }} />}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="~text-xl/2xl">{t('Product.description')}</CardTitle>
                </CardHeader>
                <CardContent>{Object.values(tagsToLong)}</CardContent>
            </Card>
            <BestSellersProducts />
            <AddToRecentlyViewed product={product} />
            <RecentlyViewed />
        </section>
    )
}
