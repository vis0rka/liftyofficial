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
        <div className="flex flex-col gap-6 lg:flex-row items-center stretch">
            {keyFeatuers.map(feature => {
                return (
                    <Card className="flex flex-col items-center lg:w-1/3 grow h-full" key={feature.imageSrc}>
                        <CardHeader className="flex flex-row items-center gap-2 w-full justify-items-start pb-2">
                            <Image src={feature.imageSrc} alt="icon feather" width={40} height={40} />
                            <CardTitle className="text-lg font-bold">{t(feature.title)}</CardTitle>
                        </CardHeader>
                        <CardContent>{t(feature.descr)}</CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
