'use server'

import { Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const ProductCarrierRate = async () => {
    const t = await getTranslations('Product')

    return (
        <div className="flex items-center gap-2 ">
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                ))}
            </div>
            <span className="text-base">{t('more_than_1000_satisfied_customers')}</span>
        </div>
    )
}
