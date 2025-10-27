// app/api/auth/magic/consume/route.ts
import { getSession } from '@/lib/auth/session'
import { deleteMagicLinkSession, getMagicLinkSession } from '@/lib/redis/session'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(process.env.MAGIC_JWT_SECRET!)

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url)
        const token = url.searchParams.get('token')
        const redirectTo = url.searchParams.get('next') || '/'

        if (!token) {
            return NextResponse.redirect(new URL('/login?error=invalid_token', req.url))
        }

        // Verify JWT
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            issuer: 'magic',
            audience: 'web',
        })

        const nonce = payload.n as string
        if (!nonce) {
            return NextResponse.redirect(new URL('/login?error=invalid_token', req.url))
        }

        // Get session data from Redis
        const sessionData = await getMagicLinkSession(nonce)
        if (!sessionData) {
            return NextResponse.redirect(new URL('/login?error=expired_token', req.url))
        }

        // Delete the used nonce (single-use)
        await deleteMagicLinkSession(nonce)

        // Create user session
        const session = await getSession()
        session.isLoggedIn = true
        session.username = sessionData.email.split('@')[0] // Use email prefix as username
        session.user_email = sessionData.email

        await session.save()

        // Redirect to the intended page
        return NextResponse.redirect(new URL(redirectTo, req.url))
    } catch (error) {
        console.error('Magic link consume error:', error)
        return NextResponse.redirect(new URL('/login?error=invalid_token', req.url))
    }
}
