'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'
import { formatCurrencyString, useShoppingCart } from 'use-shopping-cart'
import { CartEntry } from 'use-shopping-cart/core'

export const CartTable = () => {
    const { cartCount, cartDetails, removeItem } = useShoppingCart()
    const t = useTranslations()
    const notEmptyCart = (cartCount ?? 0) > 0

    return (
        <div>
            <div className="grid grid-cols-12 items-center w-full p-4">
                <h4 className="col-span-9 md:col-span-6">Product</h4>
                <h4 className="hidden md:block md:col-span-5 items-center self-center">Quantity</h4>
                <h4 className="col-span-3 md:col-span-1">Price</h4>
            </div>
            <div className="flex flex-col justify-between items-center w-full space-y-8">
                {notEmptyCart ? (
                    <>
                        {Object.values(cartDetails ?? {}).map(item => {
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
                                            <span className="text-right">
                                                {formatCurrencyString({ value: item.price, currency: 'EUR' })}
                                            </span>
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
                    </>
                ) : (
                    <div className="space-y-8">
                        <p className="~text-base/2xl">{t('Common.empty_cart')}</p>
                        <Button asChild>
                            <Link href="/shop">Continue shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

const minQuantity = 1
const maxQuantity = 99

const QuantityModifer: React.FC<{ item: CartEntry; className: string }> = ({ item, className }) => {
    const { incrementItem, decrementItem } = useShoppingCart()
    const decrease = () => {
        if (item.quantity > minQuantity) {
            decrementItem(item.id)
        }
    }

    const increase = () => {
        if (item.quantity < maxQuantity) {
            incrementItem(item.id)
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
