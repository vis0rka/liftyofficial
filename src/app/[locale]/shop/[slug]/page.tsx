import { ErrorCard } from '@/components/error/ErrorCard'
import { AddToCartBtn } from '@/components/products/card/AddToCartBtn'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { AddToRecentlyViewed } from '@/components/products/recently-viewed/AddToRecentlyViewed'
import { RecentlyViewed } from '@/components/products/recently-viewed/RecentlyViewed'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCachedProduct } from '@/lib/api/woo/products/getProducts'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ slug: string }>
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
    console.log(product)

    const isTranslatedText = extractTextInsideBraces(product.short_description)

    return (
        <section className="container mx-auto flex flex-col my-6 space-y-6">
            <Breadcrumb />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                    <ProductImageGallery images={product.images} />
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <h1 className="~text-xl/4xl">{product.name}</h1>
                            <span className="font-sans ~text-lg/2xl">€{product.price}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="space-y-4 flex flex-col items-start">
                            {isTranslatedText?.length ? (
                                <p>{t(isTranslatedText[0])}</p>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: product?.short_description }} />
                            )}
                            {inStock ? <Badge variant="success">{t('ProductPage.in_stock')}</Badge> : null}
                            {inStock && <AddToCartBtn product={product} />}
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
            <AddToRecentlyViewed product={product} />
            <RecentlyViewed />
        </section>
    )
}

function extractTextInsideBraces(input: string): string[] {
    const regex = /\{\{(.*?)\}\}/g // Match text inside {{ and }}
    const matches: string[] = []
    let match: RegExpExecArray | null

    while ((match = regex.exec(input)) !== null) {
        matches.push(match[1]?.trim()) // Push only the text inside braces, trimmed
    }

    return matches
}
