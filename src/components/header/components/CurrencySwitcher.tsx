'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { euCountries } from '@/utils/euCountries'
import axios from 'axios'
import React from 'react'

export const defaultCountry = {
    name: 'Default',
    code: 'UU',
    dial_code: '+00',
    flag: 'UU',
    currency: 'EUR',
    currency_sign: '€',
}

export default function CountrySwitcher() {
    const { country, setCountry } = useCountryStore(state => state)
    const changeCurrency = useCartStore(state => state.changeCurrency)

    const handleChange = (code: string) => {
        const country = euCountries.find(country => country.code === code) ?? defaultCountry
        setCountry(country)
        changeCurrency(country?.currency)
    }

    React.useEffect(() => {
        const getData = async () => {
            const response = await axios.get('https://api.country.is/')

            const country = euCountries.find(country => country.code === response.data.country) ?? defaultCountry

            setCountry(country)
            changeCurrency(country?.currency)
        }

        getData()
    }, [setCountry, changeCurrency])

    return (
        <Select onValueChange={handleChange} value={country?.code}>
            <SelectTrigger className="w-fit mt-auto truncate">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {euCountries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                            {country.name + ` (${country.currency} ${country.currency_sign})`}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
