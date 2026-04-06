'use client'

import { usePathname } from 'next/navigation'

import Script from 'next/script'

import { useEffect, useState } from 'react'

import * as pixel from './fbpixel'

const FacebookPixel = () => {
    const [loaded, setLoaded] = useState(false)

    const pathname = usePathname()

    useEffect(() => {
        if (!loaded || !pixel.FB_PIXEL_ID) return

        pixel.pageview()
    }, [pathname, loaded])

    useEffect(() => {
        if (!pixel.FB_PIXEL_ID) return
        const markReady = () => queueMicrotask(() => setLoaded(true))
        if (typeof window !== 'undefined' && window.fbq) {
            markReady()
            return
        }
        const interval = window.setInterval(() => {
            if (typeof window !== 'undefined' && window.fbq) {
                markReady()
                window.clearInterval(interval)
            }
        }, 32)
        const timeout = window.setTimeout(() => window.clearInterval(interval), 5000)
        return () => {
            window.clearInterval(interval)
            window.clearTimeout(timeout)
        }
    }, [])

    if (!pixel.FB_PIXEL_ID) return null

    return (
        <div>
            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `

!function(f,b,e,v,n,t,s)

{if(f.fbq)return;n=f.fbq=function(){n.callMethod?

n.callMethod.apply(n,arguments):n.queue.push(arguments)};

if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';

n.queue=[];t=b.createElement(e);t.async=!0;

t.src=v;s=b.getElementsByTagName(e)[0];

s.parentNode.insertBefore(t,s)}(window, document,'script',

'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', ${JSON.stringify(pixel.FB_PIXEL_ID)});

`,
                }}
            />
        </div>
    )
}

export default FacebookPixel
