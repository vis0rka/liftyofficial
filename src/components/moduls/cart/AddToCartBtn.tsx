'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'use-intl'

export const AddToCartBtn = () => {
    const t = useTranslations()

    return (
        <Button className="uppercase" size="lg">
            {t('Common.add_to_cart')}
        </Button>
    )
}
