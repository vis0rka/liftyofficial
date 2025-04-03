'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/hooks/useGetProductPrice'
import { Link } from '@/i18n/routing'
import { ICartItem } from '@/lib/store/cart-store'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { cn } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

export const CartTable = () => {
    const { items, removeItem, totalPrice } = useCartStore(state => state)
    const country = useCountryStore(state => state.country)
    const t = useTranslations()
    const cartCount = items.length
    const emptyCart = (cartCount ?? 0) === 0
    console.log(items)
    if (emptyCart) {
        return (
            <Card className="space-y-8 p-4">
                <p className="~text-base/2xl">{t('Common.empty_cart')}</p>
                <Button asChild>
                    <Link href="/shop" className="uppercase">
                        {t('Common.continue_shopping')}
                    </Link>
                </Button>
            </Card>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <div className="grid grid-cols-12 items-center w-full p-4">
                    <h4 className="col-span-9 md:col-span-6">Product</h4>
                    <h4 className="hidden md:block md:col-span-5 items-center self-center">Quantity</h4>
                    <h4 className="col-span-3 md:col-span-1">Price</h4>
                </div>
                <div className="flex flex-col justify-between items-center w-full space-y-8">
                    {items.map(item => {
                        return (
                            <Card key={item.id} className="w-full relative">
                                <CardContent className="p-4 grid grid-cols-12 items-center grid-rows justify-between">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={100}
                                            height={100}
                                            priority
                                            style={{ objectFit: 'contain' }}
                                            className="col-span-2 md:col-span-1"
                                        />
                                    )}

                                    <Link href={`/shop/${item?.slug}`} className="col-span-10 md:col-span-5 my-4">
                                        <p className="~text-sm/lg hover:underline">{item.name}</p>
                                    </Link>
                                    <QuantityModifer
                                        item={item}
                                        className="flex col-start-3 col-span-7  md:col-span-5"
                                    />
                                    <div className="col-span-3 md:col-span-1 items-end">
                                        <span className="text-right">{formatPrice(item.price, country.currency)}</span>
                                    </div>
                                </CardContent>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 hover:bg-red-100 bg-white shadow transition-colors rounded-full duration-500"
                                >
                                    <Trash2 />
                                </Button>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-row justify-between">
                <Button asChild variant="ghost">
                    <Link href="/">Continue shopping</Link>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Total: {formatPrice(totalPrice, country.currency)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button asChild size="lg">
                            <Link href="/checkout">Checkout</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const minQuantity = 1
const maxQuantity = 99

const QuantityModifer: React.FC<{ item: ICartItem; className: string }> = ({ item, className }) => {
    const { incrementItemQuantity, decrementItemQuantity } = useCartStore(state => state)
    const decrease = () => {
        if (item.quantity > minQuantity) {
            decrementItemQuantity(item.id)
        }
    }

    const increase = () => {
        if (item.quantity < maxQuantity) {
            incrementItemQuantity(item.id)
        }
    }

    return (
        <div className={cn('items-center md:space-x-2', className)}>
            <Button
                variant="outline"
                size="icon"
                onClick={decrease}
                disabled={item.quantity <= minQuantity}
                aria-label="Decrease quantity"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <div className="w-8 text-center tabular-nums" aria-live="polite">
                {item.quantity}
            </div>
            <Button
                variant="outline"
                size="icon"
                onClick={increase}
                disabled={item.quantity >= maxQuantity}
                aria-label="Increase quantity"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    )
}
