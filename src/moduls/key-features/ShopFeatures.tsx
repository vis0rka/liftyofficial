'use server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sprout, Truck, Undo2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const shopFeatures = [
    {
        icon: Undo2,
        title: 'ShopFeatures.30_return',
        descr: 'ShopFeatures.30_return_desc',
    },
    {
        icon: Truck,
        title: 'ShopFeatures.fast_shipping',
        descr: 'ShopFeatures.fast_shipping_desc',
    },
    {
        icon: Sprout,
        title: 'ShopFeatures.eco_friendly',
        descr: 'ShopFeatures.eco_friendly_desc',
    },
]

export const ShopFeatures = async () => {
    const t = await getTranslations()
    return (
        <div className="flex flex-col items-stretch gap-6 lg:flex-row">
            {shopFeatures.map(feature => {
                const IconComponent = feature.icon
                return (
                    <Card
                        className="rounded-[2rem] @container border border-white/70 bg-white/80 p-7 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg lg:basis-1/3"
                        key={feature.title}
                    >
                        <CardHeader className="p-0 items-start @sm:flex-row @sm:items-baseline gap-4">
                            <div className="inline-flex rounded-2xl bg-amber-100 p-3 text-neutral-900">
                                <IconComponent className="h-8 w-8" />
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
