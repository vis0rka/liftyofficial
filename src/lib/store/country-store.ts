import { euCountries } from '@/utils/euCountries'
import { ArrayElement } from '@/utils/typeUtils'
import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

type Country = ArrayElement<typeof euCountries>

type CountryState = {
    country: Omit<Partial<Country>, 'currency'> & { currency: string }
}

type CountryActions = {
    setCountry: (country: Country) => void
}

const defaultInitalState = {
    country: {
        currency: 'EUR',
    },
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
