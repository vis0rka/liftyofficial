'use server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

const keyFeatuers = [
    {
        imageSrc: '/images/icons/feather-outline.webp',
        title: 'KeyFeatures.first.title',
        descr: 'KeyFeatures.first.description',
    },
    {
        imageSrc: '/images/icons/easy.webp',
        title: 'KeyFeatures.second.title',
        descr: 'KeyFeatures.second.description',
    },
    {
        imageSrc: '/images/icons/compact.webp',
        title: 'KeyFeatures.third.title',
        descr: 'KeyFeatures.third.description',
    },
]

export const KeyFeatures = async () => {
    const t = await getTranslations()
    return (
        <div className="flex flex-col items-stretch gap-6 lg:flex-row">
            {keyFeatuers.map(feature => {
                return (
                    <Card
                        className="rounded-[2rem] @container border border-white/70 bg-white/80 p-7 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg lg:basis-1/3"
                        key={feature.title}
                    >
                        <CardHeader className="p-0 items-start @sm:flex-row @sm:items-baseline gap-4">
                            <div className="inline-flex rounded-2xl bg-amber-100 p-3 text-neutral-900">
                                <Image
                                    src={feature.imageSrc}
                                    alt={t(feature.title)}
                                    width={24}
                                    height={24}
                                    className="h-8 w-8 object-contain"
                                />
                            </div>
                            <CardTitle className="text-xl font-semibold text-neutral-900">{t(feature.title)}</CardTitle>
                        </CardHeader>
                        <CardContent className="mt-3 p-0 text-sm leading-7 text-neutral-600">
                            {t(feature.descr)}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
