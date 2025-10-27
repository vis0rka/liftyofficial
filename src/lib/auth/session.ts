import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
    username: string
    isLoggedIn: boolean
    user_email: string
    user_id: number | null
}

export const defaultSession: SessionData = {
    username: '',
    isLoggedIn: false,
    user_email: '',
    user_id: null,
}

export const sessionOptions: SessionOptions = {
    password: 'BQBFoTi1Foq1xLXF9WbLXKyxzT5fWqtV',
    cookieName: 'lifty_session',
    cookieOptions: {
        // secure only works in `https` environments
        // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15, // 15 minutes
    },
}

export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    return session
}
