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
        <div className="flex flex-col gap-6 lg:flex-row items-stretch">
            {shopFeatures.map(feature => {
                const IconComponent = feature.icon
                return (
                    <Card className="flex flex-col items-center lg:basis-1/3 full justify-between" key={feature.title}>
                        <CardHeader className="flex flex-row items-center gap-2 w-full justify-center pb-2">
                            <IconComponent size={30} />
                            <CardTitle className="text-lg font-bold">{t(feature.title)}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex text-center">{t(feature.descr)}</CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
