'use client'

import { Button } from '@/components/ui/button'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import { useTranslations } from 'use-intl'
import { useShoppingCart } from 'use-shopping-cart'

interface Props {
    product: ArrayElement<WooTypes['getProducts']>
}

export const AddToCartBtn: React.FC<Props> = ({ product }) => {
    const t = useTranslations()
    const { addItem, handleCartHover } = useShoppingCart()

    const handleAdd = () => {
        const productDetails = {
            name: product.name,
            sku: product.sku,
            price: Number(product.price) * 100,
            currency: 'EUR',
            image: product?.images[0].src,
            slug: product.slug,
            product_data: {
                metadata: {
                    type: 'clothes',
                },
            },
        }

        addItem(productDetails)
        handleCartHover()
    }

    return (
        <Button className="uppercase" size="lg" onClick={() => handleAdd()}>
            {t('Common.add_to_cart')}
        </Button>
    )
}
