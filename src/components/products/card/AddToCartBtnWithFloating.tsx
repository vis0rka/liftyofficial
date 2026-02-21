'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductPrice, useGetProductPrice } from '@/hooks/useGetProductPrice'
import { WooTypes } from '@/lib/api/woo/WooTyps'
import { ICartItem } from '@/lib/store/cart-store'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { cn } from '@/lib/utils'
import { ArrayElement } from '@/utils/typeUtils'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'use-intl'

interface Props {
    product: ArrayElement<WooTypes['getProducts']>
    buttonProps?: ButtonProps
    name: string
}

export const AddToCartBtnWithFloating: React.FC<Props> = ({ product, buttonProps, name }) => {
    const t = useTranslations()
    const { addItem, handleOpenCart } = useCartStore(state => state)
    const { country } = useCountryStore(state => state)
    const { price } = useGetProductPrice({ prices: product.custom_prices, price: product.price })
    const [isVisible, setIsVisible] = useState(true)
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const lastScrollY = useRef(0)

    useEffect(() => {
        if (!buttonRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 0.1,
                rootMargin: '0px',
            },
        )

        observer.observe(buttonRef.current)

        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY > lastScrollY.current) {
                // Scrolling down
                setScrollDirection('down')
            } else if (currentScrollY < lastScrollY.current) {
                // Scrolling up
                setScrollDirection('up')
            }

            lastScrollY.current = currentScrollY
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        lastScrollY.current = window.scrollY

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

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

    const shouldShowFloating = !isVisible && scrollDirection === 'up'

    const FloatingButton = (
        <div
            className={cn(
                'max-w-sm mx-auto fixed bottom-0 left-0 right-0 z-5 flex items-center justify-center p-4 bg-background border rounded-t-sm shadow-lg transition-all duration-300 ease-in-out',
                shouldShowFloating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none',
            )}
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        >
            <div className="flex flex-col items-center justify-center gap-4 w-full">
                <h1 className="heading-3 text-center">{name}</h1>
                <Button className="uppercase w-full" size="lg" onClick={() => handleAdd()} {...buttonProps}>
                    <div className="flex gap-6 items-stretch justify-center">
                        <p>
                            <ProductPrice prices={product.custom_prices} price={product.price} />
                        </p>
                        <span className="flex items-stretch">
                            <Separator orientation="vertical" />
                        </span>
                        <p>{t('Common.add_to_cart')}</p>
                    </div>
                </Button>
            </div>
        </div>
    )

    return (
        <>
            <Button ref={buttonRef} className="uppercase" size="lg" onClick={() => handleAdd()} {...buttonProps}>
                {t('Common.add_to_cart')}
            </Button>
            {createPortal(FloatingButton, document.body)}
        </>
    )
}
