import { NextResponse } from 'next/server'

const revalidateTime = 60 * 60 * 6

export async function GET() {
    try {
        const response = await fetch('https://latest.currency-api.pages.dev/v1/currencies/eur.json', {
            next: { revalidate: revalidateTime },
        })

        if (!response.ok) {
            const backupResponse = await fetch(
                `https://v6.exchangerate-api.com/v6/f1160a34c5ff3bb423bb5b25/latest/EUR`,
                {
                    next: { revalidate: revalidateTime },
                },
            )

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
