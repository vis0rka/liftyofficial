'use server'
import { Herobanner } from '@/components/herobanner/Herobanner'
import { KeyFeatures } from '@/moduls/key-features/KeyFeatures'
import { ShopFeatures } from '@/moduls/key-features/ShopFeatures'
import { BestSellersProducts } from '@/moduls/products/BestSellersProducts'

import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export default async function HomePage() {
    const t = await getTranslations('HomePage')

    return (
        <div className="space-y-8">
            <Herobanner
                translations={{
                    the_toddler_hip_carrier: t('the_toddler_hip_carrier'),
                    the_essentials_for_adventures: t('the_essentials_for_adventures'),
                }}
            />
            <div className="w-full mx-auto flex flex-col space-y-10">
                <section className="px-4 mx-auto w-full">
                    <BestSellersProducts />
                </section>
                <section className="m-w-[600px] mx-auto px-4">
                    <div className="flex flex-col justify-center items-center lg:space-x-12 space-y-10 lg:flex-row">
                        <div className="w-full space-y-4 flex flex-col items-center justify-center lg:w-1/2">
                            <h1 className="text-4xl text-center">{t('Card1.title')}</h1>
                            <p className="text-center">{t('Card1.desc')}</p>
                        </div>
                        <div className="lg:w-1/2 flex justify-center items-center">
                            <Image
                                src="/images/lifty-premium-hip-carrier-green-lake.webp"
                                width={600}
                                height={600}
                                alt="lifty-toddler-carrier-autumn"
                                style={{
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    </div>
                </section>
                <section className="px-4">
                    <KeyFeatures />
                </section>
                <section className="mx-auto px-4">
                    <div className="flex flex-col justify-center items-center lg:space-x-12 space-y-10 lg:flex-row">
                        <div className="lg:w-1/2 flex justify-center items-center">
                            <Image
                                src="/images/lifty-red-carrier-at-lake.webp"
                                width={600}
                                height={600}
                                alt="lifty-toddler-carrier-red-at-lake"
                                style={{
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                        <div className="w-full space-y-4 flex flex-col items-center justify-start lg:w-1/2">
                            <h1 className="text-4xl text-center">{t('Card2.title')}</h1>
                            <p className="text-center">{t('Card2.desc1')}</p>
                            <p className="text-center">{t('Card2.desc2')}</p>
                        </div>
                    </div>
                </section>
                <section className="px-4">
                    <ShopFeatures />
                </section>
            </div>
        </div>
    )
}
