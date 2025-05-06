'use client'

import { useCartStore } from '@/lib/store/useCartStore'
import { useEffect } from 'react'

export const ClearCart = () => {
    const { clearCart } = useCartStore(state => state)

    useEffect(() => {
        clearCart()
    }, [clearCart])

    return null
}
