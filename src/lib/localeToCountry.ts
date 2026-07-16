import { euCountries } from '@/utils/euCountries'
import { ArrayElement } from '@/utils/typeUtils'

type Country = ArrayElement<typeof euCountries>

const localeToCountryCode: Record<string, string | undefined> = {
    de: 'DE',
    pl: 'PL',
}

export function getCountryFromLocale(locale: string): Country | null {
    const countryCode = localeToCountryCode[locale]
    if (!countryCode) return null

    return euCountries.find(country => country.code === countryCode) ?? null
}
