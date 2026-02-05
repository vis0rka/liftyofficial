import { KeyFeatures } from '@/moduls/key-features/KeyFeatures'
import { ShopFeatures } from '@/moduls/key-features/ShopFeatures'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import dottedImage from './media/dotted-description-2.webp'

const videoRatio = 3

export const CarrierLongDescription = async () => {
    const t = await getTranslations('Product')
    return (
        <div className="space-y-4">
            <KeyFeatures />
            <div className="flex flex-col-reverse lg:flex-row gap-4 items-center justify-center">
                <div className="basis-1/2 flex justify-end">
                    <iframe
                        width={1080 / videoRatio}
                        height={1920 / videoRatio}
                        src="https://www.youtube.com/embed/QBzpjMYTM5I?autoplay=1&mute=1&playlist=QBzpjMYTM5I&loop=1"
                        title="Lifty - Toddler hip carrier - 2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen={true}
                        className="rounded-lg overflow-hidden shadow"
                    />
                </div>
                <div className="basis-1/2 flex-col space-y-4 justify-start">
                    <h2 className="heading-2">{t('toddler_carrier.light_fast_effortless')}</h2>
                    <p>{t('toddler_carrier.light_fast_effortless_desc')}</p>
                </div>
            </div>
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

            <ShopFeatures />
        </div>
    )
}
