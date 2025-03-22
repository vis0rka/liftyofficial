import { ArrayElement } from '@/utils/typeUtils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WooTypes } from '../api/woo/WooTyps'

interface RecentlyViewedState {
    products: WooTypes['getProducts']
    addProduct: (product: ArrayElement<WooTypes['getProducts']>) => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        set => ({
            products: [],
            addProduct: product =>
                set(state => ({
                    products: [product, ...state.products.filter(p => p.id !== product.id)].slice(0, 4),
                })),
        }),
        {
            name: 'recently-viewed-storage',
        },
    ),
)
