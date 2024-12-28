import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardImage } from './CardImage'

interface ProductCardProps {
    product: ArrayElement<WooTypes['getProducts']>
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const t = useTranslations()

    return (
        <Link href={`/shop/${product.id}`}>
            <div className="flex-shrink-0 flex flex-col lg:flex-1 shadow overflow-hidden rounded-md min-w-[250px] max-w-[150px] lg:max-w-full">
                <CardImage productImages={product.images} />

                <div className="p-5 flex flex-col items-center">
                    <h1 className="text-lg text-center font-bold">Lifty - {t('Common.toddler_carrier')}</h1>
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-center text-2xl font-bold font-sans">€ {product.price}</span>
                    </div>
                    <Button className="mt-4">
                        <p>View</p>
                    </Button>
                </div>
            </div>
        </Link>
    )
}
