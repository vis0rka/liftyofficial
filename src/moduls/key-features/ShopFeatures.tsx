'use server'
import { Sprout, Truck, Undo2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const ShopFeatures = async () => {
    const t = await getTranslations()
    return (
        <div className="flex flex-col gap-8 lg:flex-row items-center w-full">
            <div className="flex flex-col items-center lg:w-1/3 grow">
                <Undo2 />
                <h3 className="text-lg font-bold">{t('ShopFeatures.30_return')}</h3>
                <p>{t('ShopFeatures.30_return_desc')}</p>
            </div>
            <div className="flex flex-col items-center lg:w-1/3 grow">
                <Truck />
                <h3 className="text-lg font-bold">{t('ShopFeatures.fast_shipping')}</h3>
                <p>{t('ShopFeatures.fast_shipping_desc')}</p>
            </div>
            <div className="flex flex-col items-center lg:w-1/3 grow">
                <Sprout />
                <h3 className="text-lg font-bold">{t('ShopFeatures.eco_friendly')}</h3>
                <p>{t('ShopFeatures.eco_friendly_desc')}</p>
            </div>
        </div>
    )
}
