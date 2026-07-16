'use client'

import { getCountryFromLocale } from '@/lib/localeToCountry'
import { useCartStore } from '@/lib/store/useCartStore'
import { CountryStoreContext } from '@/lib/store/useCountryStore'
import { euCountries } from '@/utils/euCountries'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useContext, useEffect } from 'react'

async function initializeCountry(
    locale: string,
    setCountry: (country: (typeof euCountries)[number]) => void,
    changeCurrency: (currency: string) => void,
) {
    const countryFromLocale = getCountryFromLocale(locale)
    if (countryFromLocale) {
        setCountry(countryFromLocale)
        changeCurrency(countryFromLocale.currency)
        return
    }

    if (locale === 'en') {
        try {
            const response = await axios.get('https://api.country.is/')
            const countryFromGeo = euCountries.find(country => country.code === response.data.country)

            if (countryFromGeo) {
                setCountry(countryFromGeo)
                changeCurrency(countryFromGeo.currency)
                return
            }
        } catch {
            // fall through to EUR fallback
        }
    }

    changeCurrency('EUR')
}

export function CountryInitializer() {
    const countryStore = useContext(CountryStoreContext)
    const changeCurrency = useCartStore(state => state.changeCurrency)
    const { locale } = useParams()

    useEffect(() => {
        if (!countryStore) return

        const runInitialization = () => {
            const { country, setCountry } = countryStore.getState()

            if (country.code) return

            void initializeCountry(locale as string, setCountry, changeCurrency)
        }

        if (countryStore.persist.hasHydrated()) {
            runInitialization()
            return
        }

        return countryStore.persist.onFinishHydration(runInitialization)
    }, [countryStore, locale, changeCurrency])

    return null
}
