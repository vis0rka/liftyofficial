import { NextResponse } from 'next/server'

export const revalidate = 60 * 60 * 12

export async function GET() {
    try {
        const response = await fetch('https://latest.currency-api.pages.dev/v1/currencies/eur.json')

        if (!response.ok) {
            const backupResponse = await fetch(`https://v6.exchangerate-api.com/v6/f1160a34c5ff3bb423bb5b25/latest/EUR`)

            const data = await backupResponse.json()

            return NextResponse.json(data?.conversion_rates)
        }

        const data = await response.json()
        return NextResponse.json(data?.eur)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
    }
}
