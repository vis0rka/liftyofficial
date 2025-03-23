'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCountryStore } from '@/lib/store/useCountryStore'
import euCountries from '@/utils/euCountries.json'
import { Geo } from '@vercel/functions'
import React from 'react'

const defaultCountry = {
    name: 'Unknown',
    code: 'UU',
    dial_code: '+00',
    flag: 'UU',
    currency: 'EUR',
    currency_sign: '€',
}

export default function CurrencySwitcher() {
    const { country, setCountry } = useCountryStore()

    const handleChange = (code: string) => {
        const country = euCountries.find(country => country.code === code)

        setCountry(country ?? defaultCountry)
    }
    console.log(country)
    React.useEffect(() => {
        const getData = async () => {
            const response = (await fetch('/api/geo')) as Geo
            console.log(response)
            const country = euCountries.find(country => country.code === response.country)

            setCountry(country ?? defaultCountry)
        }

        getData()
    }, [setCountry])

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
