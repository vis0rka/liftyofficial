'use server'
import { getTranslations } from 'next-intl/server'

export const CarrierShortDescription = async () => {
    const t = await getTranslations('Product')

    return <p>{t('toddler_carrier.short')}</p>
}
