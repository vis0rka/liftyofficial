'use client'

import { useCountryStore } from '@/lib/store/useCountryStore'

type Props = {
    prices?: string
    price: string
}

// Map European (and some nearby) currency codes to locales.
const currencyLocaleMap: Record<string, string> = {
    EUR: 'de-DE', // Euro — many European countries use different locales;
    // here we choose German formatting as a default.
    PLN: 'pl-PL', // Polish złoty
    GBP: 'en-GB', // British Pound Sterling
    CHF: 'de-CH', // Swiss Franc (using German-Swiss formatting)
    SEK: 'sv-SE', // Swedish Krona
    NOK: 'nb-NO', // Norwegian Krone
    DKK: 'da-DK', // Danish Krone
    CZK: 'cs-CZ', // Czech Koruna
    HUF: 'hu-HU', // Hungarian Forint
    RON: 'ro-RO', // Romanian Leu
    BGN: 'bg-BG', // Bulgarian Lev
    ISK: 'is-IS', // Icelandic Króna
    RUB: 'ru-RU', // Russian Ruble (for the European part of Russia)
    // Add other currencies and their typical locales as needed
}

/**
 * Returns an Intl.NumberFormat instance configured for the given currency.
 *
 * @param currency - The ISO currency code (e.g., 'PLN', 'EUR', 'GBP')
 * @returns A number formatter for the specified currency.
 */
export const getCurrencyFormatter = (currency: string): Intl.NumberFormat => {
    // Fall back to 'en-GB' if the currency isn't in our mapping.
    const locale = currencyLocaleMap[currency] || 'en-GB'
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        // You can add additional options here if needed (e.g., minimumFractionDigits)
    })
}

/**
 * Formats an amount with the appropriate currency formatting.
 *
 * @param amount - The numeric value to format.
 * @param currency - The ISO currency code (e.g., 'PLN', 'EUR', 'GBP')
 * @returns The formatted currency string.
 */
export const formatPrice = (amount: number, currency: string): string => {
    return getCurrencyFormatter(currency).format(amount)
}

export const useGetProductPrice = ({ prices, price }: Props) => {
    const { country } = useCountryStore(state => state)

    if (!prices || !country?.currency) {
        return {
            price: Number(price),
            formattedPrice: formatPrice(Number(price), 'EUR'),
        }
    }

    const normalizedPrices = JSON.parse(prices) as Record<string, string>

    const modifedPrice = normalizedPrices[country.currency]

    return {
        price: Number(modifedPrice ?? price),
        formattedPrice: formatPrice(Number(modifedPrice ?? price), modifedPrice ? country.currency : 'EUR'),
    }
}

export const ProductPrice = ({ prices, price }: Props) => {
    const { formattedPrice } = useGetProductPrice({ prices, price })

    return formattedPrice
}
