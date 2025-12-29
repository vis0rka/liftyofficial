import { revalidatePath, revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret')

    if (secret !== 'SECRET') {
        return Response.json({ message: 'Invalid secret' }, { status: 401 })
    }

    const tag = request.nextUrl.searchParams.get('tag')

    if (tag) {
        revalidateTag(tag, 'default')
        return Response.json({ revalidated: true })
    }

    const path = request.nextUrl.searchParams.get('path')

    if (path) {
        revalidatePath(path)
        return Response.json({ revalidated: true })
    }

    return Response.json({
        revalidated: false,
        message: 'Missing path or tag to revalidate',
    })
}
