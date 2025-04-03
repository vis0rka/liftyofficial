'use client'

import { formatPrice } from '@/hooks/useGetProductPrice'
import { Link } from '@/i18n/routing'
import { ICartItem } from '@/lib/store/cart-store'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'

import { Trash2 } from 'lucide-react'
import Image from 'next/image'

export const CartItem: React.FC<{ item: ICartItem }> = ({ item }) => {
    const { name, quantity, price } = item
    const removeItem = useCartStore(state => state.removeItem)
    const { country } = useCountryStore(state => state)

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
            <div className="flex flex-col gap-2 w-full">
                <div>
                    <Link href={`/shop/${item?.slug}`}>
                        <p className="hover:underline">
                            {name} <span className="text-xs">({quantity})</span>
                        </p>
                    </Link>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="font-bold font-sans">{formatPrice(price * quantity, country.currency)}</div>
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
