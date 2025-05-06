'use client'

import { Button } from '@/components/ui/button'
import { CartSheetContent, Sheet, SheetFooter, SheetTrigger } from '@/components/ui/sheet'
import { Link } from '@/i18n/routing'
import { useCartStore } from '@/lib/store/useCartStore'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { toast } from 'react-hot-toast'
import { CartItem } from './CartItem'

export const Cart: React.FC = () => {
    const { items, shouldDisplayCart, handleOpenCart, handleCloseCart, _hasHydrated, validateCart } = useCartStore(
        state => state,
    )
    const t = useTranslations()
    const cartCount = items.length
    const notEmptyCart = (cartCount ?? 0) > 0

    React.useEffect(() => {
        if (_hasHydrated) {
            const validate = async () => {
                const removedItems = await validateCart()

                if (removedItems.length > 0) {
                    toast.success(t('Common.cart_updated'), {
                        duration: 6000,
                        icon: <ShoppingCart className="h-20 w-20" />,
                    })
                }
            }

            validate()
        }
    }, [_hasHydrated, validateCart, t])

    return (
        <Sheet
            open={shouldDisplayCart}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    handleCloseCart()
                } else {
                    handleOpenCart()
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
                                {items.map(entry => (
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
