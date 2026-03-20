import { FeatureVideoSection } from '@/components/features/FeatureVideoSection'
import { CarrierFeatureVideo } from '@/components/products/carrier/CarrierFeatureVideo'
import { KeyFeatures } from '@/moduls/key-features/KeyFeatures'
import { ShopFeatures } from '@/moduls/key-features/ShopFeatures'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import dottedImage from './media/dotted-description-2.webp'

const ratio = 2

export const CarrierLongDescription = async () => {
    const t = await getTranslations('Product')
    const tHome = await getTranslations('HomePage')

    return (
        <div className="space-y-4">
            <KeyFeatures />
            <FeatureVideoSection
                id="feature-video"
                badge={tHome('EverydayMoments.badge')}
                title={t('toddler_carrier.light_fast_effortless')}
                description={t('toddler_carrier.light_fast_effortless_desc')}
                items={[
                    tHome('EverydayMoments.items.short_distances'),
                    tHome('EverydayMoments.items.stairs_travel'),
                    tHome('EverydayMoments.items.easy_to_pack'),
                    tHome('EverydayMoments.items.closeness_comfort'),
                ]}
                videoWidth={661 / ratio}
                videoHeight={1175 / ratio}
                videoPosition="left"
                video={
                    <CarrierFeatureVideo
                        width={661 / ratio}
                        height={1175 / ratio}
                        className="block h-full w-full rounded-[1.25rem]"
                    />
                }
            />
            <ProductDetailsSection />
            <ShopFeatures />
        </div>
    )
}

export async function ProductDetailsSection() {
    const t = await getTranslations('Product')
    const detailFeatures = [
        {
            number: '01',
            title: t('toddler_carrier.product_details.features.1.title'),
            text: t('toddler_carrier.product_details.features.1.text'),
        },
        {
            number: '02',
            title: t('toddler_carrier.product_details.features.2.title'),
            text: t('toddler_carrier.product_details.features.2.text'),
        },
        {
            number: '03',
            title: t('toddler_carrier.product_details.features.3.title'),
            text: t('toddler_carrier.product_details.features.3.text'),
        },
        {
            number: '04',
            title: t('toddler_carrier.product_details.features.4.title'),
            text: t('toddler_carrier.product_details.features.4.text'),
        },
    ]

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                <div>
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#e8ddd3] bg-[#fffaf6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
                            <Sparkles className="h-3.5 w-3.5" />
                            {t('toddler_carrier.product_details.badge')}
                        </div>

                        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
                            {t('toddler_carrier.product_details.title')}
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600">
                            {t('toddler_carrier.product_details.description')}
                        </p>

                        <div className="mt-10 space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900">
                                    {t('toddler_carrier.product_details.section_1_title')}
                                </h3>
                                <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600 md:text-base">
                                    {t('toddler_carrier.product_details.section_1_text')}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900">
                                    {t('toddler_carrier.product_details.section_2_title')}
                                </h3>
                                <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600 md:text-base">
                                    {t('toddler_carrier.product_details.section_2_text')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            {[
                                t('toddler_carrier.product_details.items.1'),
                                t('toddler_carrier.product_details.items.2'),
                                t('toddler_carrier.product_details.items.3'),
                                t('toddler_carrier.product_details.items.4'),
                            ].map(item => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-2xl border border-[#eee5dc] bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm"
                                >
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-neutral-900" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="grid gap-5">
                        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-xl shadow-neutral-900/10">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#f7ebe0_0%,#edf3ef_100%)]">
                                <Image
                                    className=""
                                    src={dottedImage.src}
                                    alt="lifty dotted image for description"
                                    width={650}
                                    height={600}
                                    style={{
                                        height: 'auto',
                                        maxHeight: 'auto',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {detailFeatures.map(item => (
                                <div
                                    key={item.number}
                                    className="rounded-[1.75rem] border border-[#ece4dc] bg-[#fffdfa] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                                        {item.number}
                                    </div>
                                    <h3 className="mt-3 text-lg font-semibold text-neutral-900">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-neutral-600">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
