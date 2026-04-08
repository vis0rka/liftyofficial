'use client'

import Clarity from '@microsoft/clarity'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? 'w8jsloda08'
const VISITOR_STORAGE_KEY = 'lifty_clarity_visitor_id'

function getOrCreateVisitorId(): string {
    let id = sessionStorage.getItem(VISITOR_STORAGE_KEY)
    if (!id) {
        id = crypto.randomUUID()
        sessionStorage.setItem(VISITOR_STORAGE_KEY, id)
    }
    return id
}

/** Microsoft Clarity — only mounted when analytics cookies are accepted; identify on each route for stable SPA visitor stitching. */
export function ClarityAnalytics() {
    const pathname = usePathname()

    useEffect(() => {
        Clarity.init(CLARITY_PROJECT_ID)
        Clarity.consent(true)
        return () => {
            Clarity.consent(false)
        }
    }, [])

    useEffect(() => {
        const visitorId = getOrCreateVisitorId()
        Clarity.identify(visitorId, undefined, pathname)
    }, [pathname])

    return null
}
