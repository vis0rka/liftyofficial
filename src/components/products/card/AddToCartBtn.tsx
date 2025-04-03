'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useGetProductPrice } from '@/hooks/useGetProductPrice'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ICartItem } from '@/lib/store/cart-store'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { ArrayElement } from '@/utils/typeUtils'
import { useTranslations } from 'use-intl'

interface Props {
    product: ArrayElement<WooTypes['getProducts']>
    buttonProps?: ButtonProps
}

export const AddToCartBtn: React.FC<Props> = ({ product, buttonProps }) => {
    const t = useTranslations()
    const { addItem, handleOpenCart } = useCartStore(state => state)
    const { country } = useCountryStore(state => state)
    const { price } = useGetProductPrice({ prices: product.custom_prices, price: product.price })

    const handleAdd = () => {
        const productDetails: ICartItem = {
            name: product.name,
            sku: product.sku,
            id: product.id.toString(),
            price: price,
            currency: country?.currency ?? 'EUR',
            image: product?.images[0].src,
            slug: product.slug,
            quantity: 1,
            product_data: {
                metadata: {
                    type: 'clothes',
                },
            },
            custom_prices: JSON.parse(product.custom_prices ?? ''),
        }

        addItem(productDetails)
        handleOpenCart()
    }

    return (
        <Button className="uppercase" size="lg" onClick={() => handleAdd()} {...buttonProps}>
            {t('Common.add_to_cart')}
        </Button>
    )
}
