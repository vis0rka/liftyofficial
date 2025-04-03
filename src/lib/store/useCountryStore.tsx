'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { type CountryStore, createCountryStore } from '@/lib/store/country-store'

export type CountryStoreApi = ReturnType<typeof createCountryStore>

export const CountryStoreContext = createContext<CountryStoreApi | undefined>(undefined)

export interface CounterStoreProviderProps {
    children: ReactNode
}

export const CountryStoreProvider = ({ children }: CounterStoreProviderProps) => {
    const storeRef = useRef<CountryStoreApi | null>(null)
    if (storeRef.current === null) {
        storeRef.current = createCountryStore()
    }

    return <CountryStoreContext.Provider value={storeRef.current}>{children}</CountryStoreContext.Provider>
}

export const useCountryStore = <T,>(selector: (store: CountryStore) => T): T => {
    const countryStoreContext = useContext(CountryStoreContext)

    if (!countryStoreContext) {
        throw new Error(`useCountryStore must be used within CountryStoreProvider`)
    }

    return useStore(countryStoreContext, selector)
}
