import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import { useTranslations } from 'next-intl'
import React from 'react'
import { CardImage } from './CardImage'

interface ProductCardProps {
    product: ArrayElement<WooTypes['getProducts']>
    hideViewButton?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, hideViewButton }) => {
    const t = useTranslations()

    return (
        <Link
            href={`/shop/${product?.slug}`}
            className='flex shrink-0 lg:shrink flex-col basis-1/2 lg:basis-auto lg:flex-1 shadow overflow-hidden rounded-md  bg-white"'
        >
            <CardImage productImages={product?.images} />

            <div className="p-2 md:p-3 lg:p-5 flex flex-col items-center">
                <h1 className="~text-md/lg text-center font-bold">
                    Lifty - {t('Common.toddler_carrier', { count: 1 })}
                </h1>
                <div className="flex flex-col justify-center items-center">
                    <span className="text-center text-2xl font-bold font-sans">€ {product?.price}</span>
                </div>
                {!hideViewButton ? (
                    <Button className="mt-4">
                        <p className="~text-sm/base">{t('Common.view')}</p>
                    </Button>
                ) : null}
            </div>
        </Link>
    )
}
