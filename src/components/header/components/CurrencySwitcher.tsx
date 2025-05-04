'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCountryStore } from '@/lib/store/useCountryStore'
import { euCountries } from '@/utils/euCountries'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function CountrySwitcher() {
    const { country, setCountry } = useCountryStore(state => state)
    const changeCurrency = useCartStore(state => state.changeCurrency)
    const t = useTranslations()

    const handleChange = (code: string) => {
        const country = euCountries.find(country => country.code === code)
        if (country) {
            setCountry(country)
            changeCurrency(country?.currency ?? '')
        }
    }

    React.useEffect(() => {
        const getData = async () => {
            const response = await axios.get('https://api.country.is/')

            const country = euCountries.find(country => country.code === response.data.country)

            if (country) {
                setCountry(country)
                changeCurrency(country?.currency)
                return
            }
            changeCurrency('EUR')
        }

        getData()
    }, [setCountry, changeCurrency])
    console.log(country)

    return (
        <Select onValueChange={handleChange} value={country?.code}>
            <SelectTrigger className="w-fit mt-auto truncate">
                <SelectValue placeholder={t('Form.select_country')} />
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
