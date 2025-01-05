import { ErrorCard } from '@/components/error/ErrorCard'
import { AddToCartBtn } from '@/components/moduls/cart/AddToCartBtn'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
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
                            <p>{t(extractTextInsideBraces(product.short_description)[0])}</p>
                            {inStock ? <Badge variant="success">{t('ProductPage.in_stock')}</Badge> : null}
                            {inStock && <AddToCartBtn />}
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
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
