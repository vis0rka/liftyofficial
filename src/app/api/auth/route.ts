import { wordpressApi } from '@/lib/api/wordpress/wordpressApi'
import { defaultSession, SessionData, sessionOptions } from '@/lib/auth/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// login
export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    const { email, password } = (await request.json()) as {
        email: string
        password: string
    }

    if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const response = await wordpressApi.login(email, password)

    if (response?.data?.status === 200) {
        session.isLoggedIn = true
        session.username = response.data.user_login
        session.token = response.data.token
        session.user_id = response.data.user_id
        session.user_email = response.data.user_email

        await session.save()

        return Response.json(session)
    }
    return Response.json(
        { error: response?.data?.code ?? 'Invalid email or password', status: response?.data?.data?.status },
        { status: 200 },
    )
}

export async function PATCH() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    await session.save()

    return Response.json(session)
}

// read session
export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    if (session.isLoggedIn !== true) {
        return Response.json(defaultSession)
    }

    return Response.json(session)
}

// logout
export async function DELETE() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    const response = await wordpressApi.logout()

    if (response?.data?.status === 200) {
        session.destroy()
        return Response.json(defaultSession)
    }
    session.destroy()
    console.error('logout error', response)
    return Response.json(defaultSession)
}
