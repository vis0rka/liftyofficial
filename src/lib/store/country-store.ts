import { ArrayElement } from '@/utils/typeUtils'
import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { defaultCountry } from '@/components/header/components/CurrencySwitcher'
import { euCountries } from '@/utils/euCountries'
type Country = ArrayElement<typeof euCountries>

type CountryState = {
    country: Country
}

type CountryActions = {
    setCountry: (country: Country) => void
}

const defaultInitalState = {
    country: defaultCountry,
}

export type CountryStore = CountryState & CountryActions

export const createCountryStore = (initalState: CountryState = defaultInitalState) =>
    createStore<CountryStore>()(
        persist(
            set => ({
                ...initalState,
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
