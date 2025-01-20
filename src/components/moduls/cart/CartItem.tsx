'use client'

import { Link } from '@/i18n/routing'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { formatCurrencyString, useShoppingCart } from 'use-shopping-cart'

import { CartEntry } from 'use-shopping-cart/core'

export const CartItem: React.FC<{ item: CartEntry }> = ({ item }) => {
    const { name, quantity, price } = item
    const { removeItem } = useShoppingCart()

    const removeItemFromCart = () => {
        removeItem(item.id)
    }

    return (
        <div className="flex items-center gap-4 mb-3 w-full">
            {item.image && (
                <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    priority
                    style={{ objectFit: 'contain' }}
                />
            )}
            <div className="flex flex-col gap-2">
                <div>
                    <Link href={`/shop/${item?.slug}`}>
                        <p className="hover:underline">
                            {name} <span className="text-xs">({quantity})</span>
                        </p>
                    </Link>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="font-bold font-sans">{formatCurrencyString({ value: price, currency: 'EUR' })}</div>
                    <button
                        onClick={() => removeItemFromCart()}
                        className="ml-auto hover:bg-emerald-50 transition-colors rounded-full duration-500 p-1"
                    >
                        <Trash2 />
                    </button>
                </div>
            </div>
        </div>
    )
}
