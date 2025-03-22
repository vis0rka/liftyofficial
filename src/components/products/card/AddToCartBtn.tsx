'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ArrayElement } from '@/utils/typeUtils'
import { useTranslations } from 'use-intl'
import { useShoppingCart } from 'use-shopping-cart'

interface Props {
    product: ArrayElement<WooTypes['getProducts']>
    buttonProps?: ButtonProps
}

export const AddToCartBtn: React.FC<Props> = ({ product, buttonProps }) => {
    const t = useTranslations()
    const { addItem, handleCartHover } = useShoppingCart()

    const handleAdd = () => {
        const productDetails = {
            name: product.name,
            sku: product.sku,
            product_id: product.id,
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
        <Button className="uppercase" size="lg" onClick={() => handleAdd()} {...buttonProps}>
            {t('Common.add_to_cart')}
        </Button>
    )
}
