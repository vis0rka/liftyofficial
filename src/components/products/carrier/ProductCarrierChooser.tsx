'use server'
import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { getCachedProducts } from '@/lib/api/woo/products/getProducts'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export const ProductCarrierChooser = async () => {
    const allProduct = await getCachedProducts()
    const t = await getTranslations('Product')

    if (!allProduct) return null

    return (
        <div className="flex w-full flex-col space-y-2 mt-4">
            <h1 className="text-base font-bold">{t('choose_your_carrier')}:</h1>
            <div className="w-full max-w-full overflow-x-auto overflow-y-hidden py-2">
                <div className="flex gap-2 min-w-max">
                    {allProduct.map(product => (
                        <Card key={product.id} className="flex-shrink-0 overflow-hidden shadow-sm">
                            <Link
                                href={`/shop/${product?.slug}`}
                                className="block shadow overflow-hidden rounded-md bg-white product-card min-w-[100px] min-h-[100px]"
                            >
                                <div className="relative overflow-hidden w-full aspect-square min-w-[100px] min-h-[100px]">
                                    <div className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100">
                                        <Image
                                            src={product?.images[0]?.src}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-105"
                                            alt={product?.images[0]?.alt}
                                        />
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
