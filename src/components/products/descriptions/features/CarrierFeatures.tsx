'use server'

import { CircleCheckBig, ClockAlert, Truck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const CarrierFeatures = async () => {
    const t = await getTranslations('Product')

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-2 grow">
                <Truck />
                <h5>{t('free_shipping')}</h5>
            </div>
            <div className="flex flex-row space-x-2 grow">
                <ClockAlert />
                <h5>{t('order_before')}</h5>
            </div>
            <div className="flex flex-row space-x-2 grow">
                <CircleCheckBig />
                <h5>{t('suitable')}</h5>
            </div>
        </div>
    )
}
