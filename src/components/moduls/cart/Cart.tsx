'use client'

import { Button } from '@/components/ui/button'
import { CartSheetContent, Sheet, SheetFooter, SheetTrigger } from '@/components/ui/sheet'
import { Link } from '@/i18n/routing'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { CartItem } from './CartItem'

export const Cart: React.FC = () => {
    const { shouldDisplayCart, cartCount, cartDetails, handleCloseCart, handleCartClick, redirectToCheckout } =
        useShoppingCart()
    const t = useTranslations()
    const notEmptyCart = (cartCount ?? 0) > 0
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'error'>('idle')

    const handleCheckout = async () => {
        setStatus('loading')

        try {
            const res = await fetch('/session', {
                method: 'POST',
                body: JSON.stringify(cartDetails),
            })
            const data = await res.json()
            const result = await redirectToCheckout(data.sessionId)
            console.log(data)
            if (result?.error) {
                console.error(res)
                setStatus('error')
            }
        } catch (error) {
            console.error(error)
            setStatus('error')
        }

        setStatus('idle')
    }

    return (
        <Sheet
            open={shouldDisplayCart}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    handleCloseCart()
                } else {
                    handleCartClick()
                }
            }}
        >
            <SheetTrigger asChild>
                <Button variant="icon" size="icon" aria-label="Shopping Cart" className="relative">
                    {notEmptyCart ? (
                        <span className="absolute top-0 right-0 bg-black text-sm text-zinc-50 w-5 h-5 rounded-full -translate-y-[6px] translate-x-[6px]">
                            {cartCount}
                        </span>
                    ) : null}
                    <ShoppingCart className="h-8 w-8" />
                </Button>
            </SheetTrigger>
            <CartSheetContent side="right" className="h-full sm:max-w-[500px]">
                <div className="flex flex-col justify-between h-full pb-10 items-center">
                    <div>
                        {notEmptyCart ? (
                            <>
                                {Object.values(cartDetails ?? {}).map(entry => (
                                    <CartItem key={entry.sku} item={entry} />
                                ))}
                            </>
                        ) : (
                            <p className="m-3 text-lg text-center">{t('Common.empty_cart')}</p>
                        )}
                    </div>
                    <SheetFooter className="flex sm:flex-col sm:space-y-4 justify-center items-center">
                        <Button disabled={!notEmptyCart} asChild size="lg">
                            <Link href="/checkout" className="uppercase" onClick={() => handleCloseCart()}>
                                {t('Common.checkout')}
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/cart" className="uppercase" onClick={() => handleCloseCart()}>
                                {t('Common.view_cart')}
                            </Link>
                        </Button>
                    </SheetFooter>
                </div>
            </CartSheetContent>
        </Sheet>
    )
}
