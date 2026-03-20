'use server'
import { FeatureSection } from '@/components/features/FeatureSection'
import { Herobanner } from '@/components/herobanner/Herobanner'
import { KeyFeatures } from '@/moduls/key-features/KeyFeatures'
import { ShopFeatures } from '@/moduls/key-features/ShopFeatures'
import { BestSellersProducts } from '@/moduls/products/BestSellersProducts'

import { FeatureVideoSection } from '@/components/features/FeatureVideoSection'
import { TravelEssentialFeatureVideo } from '@/components/products/carrier/CarrierFeatureVideo'
import { buildAlternates } from '@/lib/seo/alternates'
import { routes } from '@/utils/routes'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale })

    const siteTitle = t('Metadata.title')
    const title = `${siteTitle} | ${t('Common.home')}`

    return {
        title,
        description: t('Metadata.description'),
        alternates: buildAlternates(locale, ''),
        openGraph: {
            title,
            description: t('Metadata.description'),
            type: 'website',
            url: `/${locale}`,
        },
        twitter: {
            title,
            description: t('Metadata.description'),
        },
    }
}

export default async function HomePage() {
    const t = await getTranslations('HomePage')
    const tCommon = await getTranslations()

    const everydayMomentsContent = {
        badge: t('EverydayMoments.badge'),
        title: t('EverydayMoments.title'),
        description: t('EverydayMoments.description'),
        items: [
            t('EverydayMoments.items.short_distances'),
            t('EverydayMoments.items.stairs_travel'),
            t('EverydayMoments.items.easy_to_pack'),
            t('EverydayMoments.items.closeness_comfort'),
        ],
        primaryCtaHref: routes.shop,
        primaryCtaLabel: t('EverydayMoments.cta_shop'),
        image: (
            <Image
                src="/images/lifty-premium-hip-carrier-green-lake.webp"
                alt={t('EverydayMoments.image_alt')}
                className="h-full w-full object-cover"
                width={600}
                height={600}
            />
        ),
        supportLabel: t('EverydayMoments.quick_support.label'),
        supportTitle: t('EverydayMoments.quick_support.title'),
    }
    const travelEssentialContent = {
        title: t('TravelEssential.title'),
        description: t('TravelEssential.description_1'),
        items: [
            t('TravelEssential.items.airports_travel_days'),
            t('TravelEssential.items.stairs_uneven_streets'),
            t('TravelEssential.items.beach_walks'),
            t('TravelEssential.items.more_movement'),
        ],
        primaryCtaHref: routes.shop,
        primaryCtaLabel: t('EverydayMoments.cta_shop'),
        videoWidth: 337,
        videoHeight: 599,
        video: <TravelEssentialFeatureVideo width={337} height={599} />,
    }

    const carrySmarterContent = {
        badge: 'Carry smarter, not harder',
        title: 'Ready for Every Moment',
        description:
            "With the Lifty premium hip carrier, you're ready for every situation – whether it’s a quick outing, travel, or everyday moments. Toddlers are unpredictable. One moment they want to be carried, the next they want to explore. Lifty helps you adapt instantly, while reducing strain on your arms and making daily life easier.",
        items: [
            'Ready to use in seconds – no hassle',
            'Reduces pressure on your arms and shoulders',
            'Small enough to take anywhere',
            'Perfect for short distances and everyday situations',
        ],
        primaryCtaHref: routes.shop,
        primaryCtaLabel: t('EverydayMoments.cta_shop'),
        image: (
            <Image
                src="/images/lifty-strucc.webp"
                alt={t('EverydayMoments.image_alt')}
                className="h-full w-full object-cover"
                width={600}
                height={600}
            />
        ),
    }

    return (
        <div className="space-y-8">
            <Herobanner
                translations={{
                    the_toddler_hip_carrier: t('the_toddler_hip_carrier'),
                    the_essentials_for_adventures: t('the_essentials_for_adventures'),
                }}
            />
            <div className="w-full max-w-8xl mx-auto flex flex-col space-y-10">
                <section className="px-4 mx-auto w-full">
                    <BestSellersProducts />
                </section>
                <FeatureSection id="everyday-moments" {...everydayMomentsContent} />
                <section className="px-4">
                    <KeyFeatures />
                </section>
                <FeatureVideoSection id="your-travel-essential" {...travelEssentialContent} />
                <section className="px-4">
                    <ShopFeatures />
                </section>
                <FeatureSection id="carry-smarter" secondaryCtaHref="#gyik" {...carrySmarterContent} />
            </div>
        </div>
    )
}
