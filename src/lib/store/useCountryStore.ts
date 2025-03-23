import { ArrayElement } from '@/utils/typeUtils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import euCountries from '@/utils/euCountries.json'

type Country = ArrayElement<typeof euCountries>

interface RecentlyViewedState {
    country: Country | null
    setCountry: (country: Country) => void
}

export const useCountryStore = create<RecentlyViewedState>()(
    persist(
        set => ({
            country: null,
            setCountry: country =>
                set(() => ({
                    country,
                })),
        }),
        {
            name: 'country-storage',
        },
    ),
)
