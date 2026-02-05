'use server'

import { CircleCheckBig, ClockAlert, Truck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const CarrierFeatures = async () => {
    const t = await getTranslations('Product')

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-2 grow items-center">
                <Truck className="text-green-600 shrink-0" size={30} />
                <h5 className="font-semibold">{t('free_shipping')}</h5>
            </div>
            <div className="flex flex-row space-x-2 grow items-center">
                <ClockAlert className="text-green-600 shrink-0" size={30} />
                <h5 className="font-semibold">{t('order_before')}</h5>
            </div>
            <div className="flex flex-row space-x-2 grow items-center">
                <CircleCheckBig className="text-green-600 shrink-0" size={30} />
                <h5 className="font-semibold">{t('suitable')}</h5>
            </div>
        </div>
    )
}
