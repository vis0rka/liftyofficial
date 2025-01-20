'use client'

import { WooTypes } from '@/lib/api/woo/WooTyps'
import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore'
import { ArrayElement } from '@/utils/typeUtils'
import { useEffect } from 'react'

interface Props {
    product: ArrayElement<WooTypes['getProducts']>
}

export const AddToRecentlyViewed: React.FC<Props> = ({ product }) => {
    const addProduct = useRecentlyViewedStore(state => state.addProduct)

    useEffect(() => {
        addProduct(product)
    }, [addProduct, product])

    return null
}
