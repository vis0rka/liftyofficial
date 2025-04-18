'use server'

import SalesTax from 'sales-tax'

export type GetTaxRateResults = Awaited<ReturnType<typeof getTaxRate>>

export async function getTaxRate(countryCode: string, amount: number) {
    SalesTax.setTaxOriginCountry(countryCode)
    try {
        const tax = await SalesTax.getSalesTax(countryCode)

        const taxAmount = amount - amount / (1 + tax.rate)

        return {
            tax,
            taxAmount,
        }
    } catch (error) {
        console.error('Error fetching tax rate:', error)
        return null
    }
}
