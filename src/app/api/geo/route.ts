import { geolocation } from '@vercel/functions'
import { NextResponse } from 'next/server'

export function GET(request: Request) {
    const data = geolocation(request)

    return NextResponse.json(data)
}
