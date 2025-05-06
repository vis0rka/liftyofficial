import { KeyFeatures } from '@/moduls/key-features/KeyFeatures'
import { ShopFeatures } from '@/moduls/key-features/ShopFeatures'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import dottedImage from './media/dotted-description-2.webp'

export const CarrierLongDescription = async () => {
    const t = await getTranslations('Product')
    return (
        <div className="space-y-4">
            <p>{t('toddler_carrier.long_desc_1')}</p>
            <h2 className="~text-base/xl font-bold">{t('toddler_carrier.long_title_2')}</h2>
            <p>{t('toddler_carrier.long_desc_2')}</p>
            <h2 className="~text-base/xl font-bold">{t('toddler_carrier.long_title_3')}</h2>
            <p>{t('toddler_carrier.long_desc_3')}</p>
            <div className="flex flex-col md:flex-row gap-4 md:items-start">
                <Image
                    className="basis-md:basis-1/3"
                    src={dottedImage.src}
                    alt="lifty dotted image for description"
                    width={500}
                    height={500}
                    style={{
                        height: 'auto',
                        maxHeight: 'auto',
                        objectFit: 'contain',
                    }}
                />
                <div className="flex flex-col space-y-2 md:basis-2/3">
                    <div className="flex flex-col space-y-4">
                        <p>
                            <strong>1. </strong>
                            {t('toddler_carrier.dotted_desc_1')}
                        </p>

                        <p>
                            <strong>2. </strong>
                            {t('toddler_carrier.dotted_desc_2')}
                        </p>

                        <p>
                            <strong>3. </strong>
                            {t('toddler_carrier.dotted_desc_3')}
                        </p>

                        <p>
                            <strong>4. </strong>
                            {t('toddler_carrier.dotted_desc_4')}
                        </p>
                    </div>
                </div>
            </div>
            <KeyFeatures />
            <ShopFeatures />
        </div>
    )
}
