import { defaultSession, SessionData, sessionOptions } from '@/lib/auth/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

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

    session.destroy()
    return Response.json(defaultSession)
}
